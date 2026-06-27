
DROP POLICY "Users can update posts (likes)" ON public.posts;
CREATE POLICY "Authenticated users can like posts" ON public.posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
