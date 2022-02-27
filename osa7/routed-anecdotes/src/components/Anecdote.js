const Anecdote = ({ content, author, info, votes }) => (
  <div>
    <h2>{content} by {author}</h2>
    <p>has {votes} votes</p>
    <p>for more information see <a href={info}>{info}</a></p>
  </div>
)

export default Anecdote