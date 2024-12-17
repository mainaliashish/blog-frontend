// authGuards.js
import { useAuthStore } from '@/store/authStore'
import { usePostStore } from '@/store/postStore'

export const checkPostOwnership = async (to, from, next) => {
  const authStore = useAuthStore()
  const postStore = usePostStore()
  const postId = to.params.id

  await postStore.getPostById(postId)
  const post = postStore.currentPost

  if (!post) {
    return next({ path: '/' })
  }
  if (
    post.author_id === parseInt(authStore.userId || localStorage.getItem('userId')) ||
    localStorage.getItem('role') === 'admin'
  ) {
    return next()
  }
  setTimeout(() => {
    postStore.utilsStore.handleError('You are not authorized to edit this post.')
  }, 500)
  return next({ path: '/' })
}
