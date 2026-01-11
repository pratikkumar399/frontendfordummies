import { useEffect, useRef } from "react";

interface UseInfiniteScrollingProps {
    onLoadMore: () => void;
    hasMore: boolean;
    root?: Element | null;
    rootMargin?: string;
    disabled?: boolean;
}

const useInfiniteScrolling = ({
    onLoadMore,
    hasMore,
    root = null,
    rootMargin = "200px",
    disabled = false
}: UseInfiniteScrollingProps) => {

    const observerRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef(false);

    useEffect(() => {
        if (disabled || !hasMore) return;
        if (!observerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            console.log(entries)
            const [entry] = entries;
            if (entry.isIntersecting && !loadingRef.current && hasMore) {
                loadingRef.current = true;
                onLoadMore();
                // Reset loading flag after a short delay to prevent multiple triggers
                setTimeout(() => {
                    loadingRef.current = false;
                }, 100);
            }
        }, {
            root,
            rootMargin
        })

        observer.observe(observerRef.current);
        return () => {
            observer.disconnect();
        }
    }, [onLoadMore, hasMore, root, rootMargin, disabled])

    return { observerRef };
}

export default useInfiniteScrolling;