import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '../../serverUrl'
import './sharedComponents.css'

const Post = function ({
  post,
  noLink = false,
  noModifyButtons = false,
  showAll = true
}) {
  let navigate = useNavigate()
  const onPostClick = () => {
    if (!noLink) {
      navigate('/view/' + post.id)
    }
  }

  const postStyle = noLink
    ? {}
    : {
        cursor: 'pointer',
        padding: '20px',
        border: '8px solid #2e2727'
      }

  const postAuthorStyle = {
    cursor: 'pointer'
  }

  const [isOwnPost, setIsOwnPost] = useState(false)

  const [dummyStateBoolean, setDummyStateBoolean] = useState(false)
  const [checkIsOwnPostCounter, setCheckIsOwnPostCounter] = useState(0)

  const checkIsOwnPost = async () => {
    setTimeout(() => {
      const userId = window.sessionStorage.getItem('currentSession')
      if (userId && userId !== '') {
        if (post.author === userId || userId === 'admin') {
          setIsOwnPost(true)
        }
      }
      setCheckIsOwnPostCounter(checkIsOwnPostCounter + 1)
      setDummyStateBoolean(!dummyStateBoolean)
    }, 100)
  }

  useEffect(() => {
    if (checkIsOwnPostCounter < 500) {
      checkIsOwnPost()
    }
  }, [dummyStateBoolean])

  // useEffect(() => {
  //   if (checkIsOwnPostCounter % 10 === 0) {
  //     setDummyStateBoolean(!dummyStateBoolean)
  //   }
  // }, [checkIsOwnPostCounter])

  const [isChangingPost, setIsChangingPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTitle, setNewPostTitle] = useState('')

  const [dummyStateBoolean2, setDummyStateBoolean2] = useState(false)
  const [newPostInfoSet, setNewPostInfoSet] = useState(false)

  useEffect(() => {
    if (!newPostInfoSet) {
      if (post.title && post.content) {
        // console.log(post)
        setNewPostTitle(post.title)
        setNewPostContent(post.content)

        setNewPostInfoSet(true)
      }
      setDummyStateBoolean2(!dummyStateBoolean2)
    }
  }, [dummyStateBoolean2])

  const onPostEdit = async () => {
    if (isChangingPost) {
      const newPost = {
        id: post.id,
        author: post.author,
        content: newPostContent,
        title: newPostTitle,
        createdAt: post.createdAt,
        comments: post.comments
      }

      await axios.put(SERVER_URL + '/posts/' + post.id, newPost)

      window.location.reload()
    }

    setIsChangingPost(!isChangingPost)
  }

  const onPostDelete = async () => {
    if (window.confirm('이 글을 정말 삭제하시겠습니까?')) {
      await axios.delete(SERVER_URL + '/posts/' + post.id)
      navigate('/')
    }
  }

  const [users, setUsers] = useState([])
  const [authorName, setAuthorName] = useState('')

  const fetchAuthorName = async function () {
    const response = await axios.get(SERVER_URL + '/users')

    // setTimeout(() => {
    const data = response.data
    setUsers(data)

    if (post.author) {
      const matchingUsers = users.filter((u) => u.id === post.author)
      if (matchingUsers.length > 0) {
        const userName = matchingUsers[0].name
        setAuthorName(userName)
      }
    }

    setFetchAuthorNameCounter(fetchAuthorNameCounter + 1)
    // }, 10)
  }

  const [fetchAuthorNameCounter, setFetchAuthorNameCounter] = useState(0)

  useEffect(() => {
    if (fetchAuthorNameCounter < 50) {
      fetchAuthorName()
    }
  }, [fetchAuthorNameCounter])

  //타임스탬프 변환
  const date = new Date(post.createdAt)

  const year = date.getFullYear().toString().slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)
  const minute = ('0' + date.getMinutes()).slice(-2)
  const second = ('0' + date.getSeconds()).slice(-2)

  const returnDate =
    year + '.' + month + '.' + day + '. ' + hour + ':' + minute + ':' + second

  return (
    <div className="Post" style={postStyle} onClick={onPostClick}>
      {!isChangingPost ? (
        <>
          <h2 className="PostTitle">{post.title}</h2>
          <h3 className="PostContent">
            {showAll
              ? post.content
              : post.content
              ? post.content.substr(0, 100)
              : ''}
          </h3>
        </>
      ) : (
        <div className="editPost">
          <input
            className="editInput"
            value={newPostTitle}
            onChange={(e) => {
              setNewPostTitle(e.target.value)
            }}
          ></input>
          <textarea
            className="editTextarea"
            value={newPostContent}
            onChange={(e) => {
              setNewPostContent(e.target.value)
            }}
          ></textarea>
        </div>
      )}
      <p className="PostMetaData">
        작성자 :{' '}
        <span
          style={postAuthorStyle}
          onClick={() => {
            navigate('/profile/' + post.author)
          }}
        >
          {authorName}
        </span>{' '}
        / {returnDate}
      </p>

      {!noModifyButtons && isOwnPost ? (
        <div>
          {!isChangingPost ? (
            <>
              {' '}
              <button className="Button" onClick={onPostEdit}>
                수정
              </button>
              <button className="Button" onClick={onPostDelete}>
                삭제
              </button>
            </>
          ) : (
            <>
              <button className="Button" onClick={onPostEdit}>
                수정완료
              </button>
              <button
                className="Button"
                onClick={() => {
                  setIsChangingPost(false)
                }}
              >
                수정취소
              </button>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Post
