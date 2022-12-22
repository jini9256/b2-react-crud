import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../serverUrl'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUserState } from '../../redux/config/configStore'
import { useNavigate } from 'react-router-dom'
import Comment from './comment'

const ViewCommentsComponent = ({ postId }) => {
  const [post, setPost] = useState({})

  const [comments, setComments] = useState([])

  const fetchPost = async function () {
    const response = await axios.get(SERVER_URL + '/posts/' + postId)
    setPost(response.data)
    setComments(response.data.comments)
  }

  useEffect(() => {
    fetchPost()
  }, [])

  const [userComment, setUserComment] = useState('')

  let navigate = useNavigate()

  const onWriteComment = async () => {
    const user = getCurrentUserState()
    if (user.id === '') {
      navigate('/login')
    }

    const comment = {
      content: userComment,
      id: uuidv4(),
      author: getCurrentUserState().id,
      createdAt: Date.now()
    }

    let newComments = comments
    newComments.push(comment)
    console.log(newComments)

    const res = await axios.patch(SERVER_URL + '/posts/' + postId, {
      comments: newComments
    })
  }

  return (
    <div className="ViewCommentsComponent">
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onWriteComment()
          }}
        >
          <div>
            <label></label>
            <input
              value={userComment}
              onChange={(e) => {
                setUserComment(e.target.value)
              }}
            />
          </div>
          <button type="submit">확인</button>
        </form>
      </div>
      <div>
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />
        })}
      </div>
    </div>
  )
}

export default ViewCommentsComponent