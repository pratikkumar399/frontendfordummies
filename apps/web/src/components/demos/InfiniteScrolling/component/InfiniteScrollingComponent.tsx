"use client"

import React, { ReactNode } from 'react'
import '../style.css'
import useInfiniteScrolling from '../hooks/useInfiniteScroll';

interface InfiniteScrollingComponentProps {
    children: ReactNode;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    loader?: ReactNode | null;
    endMessage?: ReactNode | null;
}

const InfiniteScrollingComponent = ({
    children,
    onLoadMore,
    hasMore,
    isLoading,
    loader = null,
    endMessage = null
}: InfiniteScrollingComponentProps) => {

    const { observerRef } = useInfiniteScrolling({
        onLoadMore,
        hasMore: hasMore && !isLoading
    });

    return (
        <div className="infinite-scrolling-component">
            {children}
            {isLoading && loader}
            {hasMore ? <div ref={observerRef} className="infinite-scroll-sentinel" /> : endMessage}
        </div>
    )
}

export default InfiniteScrollingComponent


