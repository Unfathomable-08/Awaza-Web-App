import { getFeed, getPostsByUser } from "./post";
import type { LoadFeedParams } from "../types";

export const loadFeed = async ({
  isLoadMore = false,
  loading,
  setLoading,
  refreshing,
  setRefreshing,
  hasMore,
  setHasMore,
  cursor,
  setCursor,
  setPosts,
  isProfile = false,
  username,
  setTotalPosts,
}: LoadFeedParams) => {

  if (loading || (!isLoadMore && refreshing)) return;
  if (isLoadMore && !hasMore) return;

  if (isLoadMore) setLoading(true);
  else setRefreshing(true);

  try {
    let data;
    if (!isProfile){
      data = await getFeed(isLoadMore ? cursor ?? undefined : undefined);
      if (!data) return;
    } else {
      data = await getPostsByUser(username!, isLoadMore ? cursor ?? undefined : undefined);
      if (!data) return;
    }

    if (isLoadMore) {
      setPosts((prev: any[]) => [...prev, ...data.posts]);
    } else {
      setPosts(data.posts);
    }

    if (isProfile && setTotalPosts){
      setTotalPosts(data.totalPosts);
    }

    if (setCursor) setCursor(data.nextCursor);
    setHasMore(data.hasMore);
  } catch (err: any) {
    console.error("Feed Error:", err.message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
