import {useState} from 'react'
import blogService from '../services/blogs'
import FormField from './FormField'

const BlogForm = ({handleCreateBlog, handleError}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const blog = await blogService.create({title, author, url})
            setTitle('')
            setAuthor('')
            setUrl('')
            handleCreateBlog(blog)
        } catch (e) {
            console.error(e)
            handleError(e.response.data.error)
        }
    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <FormField name="title" value={title} onChange={setTitle}/>
                    <FormField name="author" value={author} onChange={setAuthor}/>
                    <FormField name="url" value={url} onChange={setUrl} />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm