
DROP POLICY "Authenticated users can like posts" ON public.posts;
CREATE POLICY "Owners can update their posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id UUID)
RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_likes INT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  UPDATE public.posts SET likes = likes + 1 WHERE id = post_id RETURNING likes INTO new_likes;
  RETURN new_likes;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.increment_post_likes(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_post_likes(UUID) TO authenticated;
