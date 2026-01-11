"use client"

import React, { useState, useCallback, useEffect } from 'react'
import InfiniteScrollingComponent from './component/InfiniteScrollingComponent'
import './style.css'

interface DataItem {
    id: number;
    content: string;
}

// Mock API function to simulate data fetching
const fetchMoreData = async (page: number, pageSize: number = 10): Promise<DataItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startId = (page - 1) * pageSize + 1;
    return Array.from({ length: pageSize }, (_, index) => ({
        id: startId + index,
        content: `Item ${startId + index}`
    }));
}

const Skeleton = () => (
    <div className="box skeleton">
        <div className="skeleton-content">Loading...</div>
    </div>
);

const EmptyState = () => (
    <div className="empty-state">
        <p>No more items to load</p>
    </div>
);

const InfiniteScrollingDemo = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const maxItems = 100;

    const loadMoreData = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const newData = await fetchMoreData(page);

            if (data.length + newData.length >= maxItems) {
                setHasMore(false);
            }

            setData(prev => [...prev, ...newData]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoading(false);
        }
    }, [data.length, loading, hasMore, page]);

    // Load initial data
   useEffect(() => {
        loadMoreData();
    }, []);

    return (
        <div className="infinite-scrolling-demo">
            <InfiniteScrollingComponent
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={loadMoreData}
                loader={<Skeleton />}
                endMessage={<EmptyState />}
            >
                {data.map(item => (
                    <div key={item.id} className="box">
                        {item.content}
                    </div>
                ))}
            </InfiniteScrollingComponent>
        </div>
    )
}

export default InfiniteScrollingDemo;


