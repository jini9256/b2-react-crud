import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Post from '../components/shared/post'
import { SERVER_URL } from '../serverUrl'

const ViewPost = function () {
  const params = useParams()
  const postId = params.id

  const [post, setPost] = useState([])

  const fetchPost = async function () {
    const response = await axios.get(SERVER_URL + '/posts/' + postId)
    setPost(response.data)
  }

  // 삭제버튼 이벤트 핸들러
  // const onDeleteBtn = (postId) => {
  //   axios.delete(`SERVER_URL + '/posts/' + ${postId}`)
  // }

  useEffect(() => {
    fetchPost()
  }, [])

  console.log(post)

  return (
    <div className="ViewPost">
      <Post post={post} noLink={true} />

      {/* 수정버튼  */}
      <button>수정</button>
      <button>삭제</button>
      {/* 삭제버튼 */}
      {/* <button type="button" onClick={() => onDeleteBtn(post.Id)}>
        삭제
      </button> */}
    </div>
  )
}

export default ViewPost
