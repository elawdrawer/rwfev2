"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHomeCategories } from "@/apis/home";
// import { fetchHomeCategories } from "@/lib/api/categories";

export interface Category {
  _id: string;
  name: string;
}

interface CategoryFilterProps {
  onCategoriesChange: (selectedIds: string[]) => void;
}

export function CategoryFilter({ onCategoriesChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Fetch categories and initialize selection
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchHomeCategories();
        if (data.data) {
          setCategories(data.data);
          const allCategoryIds = new Set<string>(
            data.data.map((cat: Category) => cat._id),
          );
          // setSelectedCategories();
          onCategoriesChange([]);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isInitialized) {
      getCategories();
    }
  }, []);

  // Handle scrolling state
  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth,
      );
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollState();
      container.addEventListener("scroll", updateScrollState);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollState);
      }
    };
  }, [updateScrollState]);

  const handleCategoryChange = useCallback(
    (newSelected: Set<string>) => {
      setSelectedCategories(newSelected);
      onCategoriesChange(Array.from(newSelected));
    },
    [onCategoriesChange],
  );

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const newSelected = new Set(selectedCategories);
      if (newSelected.has(categoryId)) {
        newSelected.delete(categoryId);
      } else {
        newSelected.add(categoryId);
      }
      handleCategoryChange(newSelected);
    },
    [selectedCategories, handleCategoryChange],
  );

  const toggleAll = useCallback(() => {
    const newSelected =
      selectedCategories.size === categories.length
        ? new Set<string>()
        : new Set(categories.map((cat) => cat._id));
    handleCategoryChange(newSelected);
  }, [categories, selectedCategories.size, handleCategoryChange]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="border-b sticky top-16 bg-background z-40">
        <div className="flex p-3 gap-2 overflow-x-auto no-scrollbar">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b sticky top-16 bg-background z-40 relative">
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-gray-200 p-2
            rounded-full shadow"
          onClick={scrollLeft}
        >
          {"<"}
        </button>
      )}
      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-gray-200 p-2
            rounded-full shadow"
          onClick={scrollRight}
        >
          {">"}
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex p-3 gap-2 overflow-x-auto scrollbar-hide"
      >
        <Button
          variant={selectedCategories.size === 0 ? "default" : "secondary"}
          className="rounded-full"
          size="sm"
          onClick={toggleAll}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={
              selectedCategories.has(category._id) ? "default" : "secondary"
            }
            className="rounded-full whitespace-nowrap"
            size="sm"
            onClick={() => toggleCategory(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
