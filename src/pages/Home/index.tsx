import useTitle from '@/hooks/useTitle'

const Home = () => {
  useTitle('首页')
  return (
    <>
      <h1>首页</h1>
      <p>推荐内容、热门目的地</p>
    </>
  )
}

export default Home
