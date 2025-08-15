import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTitle } from '@/hooks/useTitle'
import { Toast } from '@/components/Toast'
import { GradientButton, IconButton } from '@/components/Common'
import styles from './detail.module.styl'

interface DetailData {
  id: string
  title: string
  description: string
  author: string
  likes: number
  images: string[]
  content: string
  tags: string[]
  location: {
    name: string
    address: string
  }
  publishTime: string
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<DetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useTitle(data?.title || '详情')

  useEffect(() => {
    if (id) {
      loadDetailData(id)
    }
  }, [id])

  const loadDetailData = async (itemId: string) => {
    setLoading(true)
    try {
      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 模拟详情数据
      const mockData: DetailData = {
        id: itemId,
        title: '杭州西湖旅行攻略',
        description: '探索杭州西湖的美丽风光，发现隐藏的宝藏景点',
        author: '旅行达人',
        likes: 1234,
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        content: `
# 杭州西湖完整旅行攻略

## 景点介绍
西湖，位于浙江省杭州市西湖区龙井路1号，杭州市区西部，景区总面积49平方千米，汇水面积21.22平方千米，湖面面积6.38平方千米。

## 最佳游览时间
- **春季（3-5月）**：春暖花开，柳绿花红
- **夏季（6-8月）**：荷花盛开，夏日清凉
- **秋季（9-11月）**：秋高气爽，层林尽染
- **冬季（12-2月）**：雪景如画，别有韵味

## 主要景点
### 1. 断桥残雪
断桥残雪是西湖上著名的景色，以冬雪时远观桥面若隐若现于湖面而称著。

### 2. 苏堤春晓
苏堤春晓俗称苏公堤，为西湖十景之首。是一条贯穿西湖南北风景区的林荫大堤。

### 3. 曲院风荷
曲院风荷以夏日观荷为主题，承苏堤春晓，接平湖秋月，是西湖十景之一。

## 交通指南
- **地铁**：1号线龙翔桥站，步行约10分钟
- **公交**：多路公交可达，如7路、27路、51路等
- **自驾**：周边有多个停车场，建议提前预约

## 美食推荐
- **楼外楼**：西湖醋鱼、东坡肉
- **知味观**：小笼包、猫耳朵
- **奎元馆**：片儿川、虾爆鳝面

## 住宿建议
- **豪华型**：西湖国宾馆、杭州西子湖四季酒店
- **舒适型**：如家、汉庭等连锁酒店
- **经济型**：青年旅社、民宿

## 注意事项
1. 西湖景区较大，建议安排1-2天游览
2. 节假日人流量大，建议错峰出行
3. 注意保护环境，不要乱扔垃圾
4. 部分景点需要门票，建议提前了解

## 推荐路线
**一日游路线**：断桥残雪 → 白堤 → 孤山 → 西泠印社 → 岳王庙 → 苏堤 → 花港观鱼

**两日游路线**：
- Day1：湖心亭 → 三潭印月 → 苏堤春晓 → 花港观鱼 → 雷峰塔
- Day2：断桥残雪 → 白堤 → 平湖秋月 → 曲院风荷 → 杨公堤

希望这份攻略能帮助你更好地游览西湖！
        `,
        tags: ['西湖', '杭州', '旅游攻略', '江南', '古典园林'],
        location: {
          name: '西湖风景名胜区',
          address: '浙江省杭州市西湖区龙井路1号'
        },
        publishTime: '2024-01-15'
      }

      setData(mockData)
    } catch (error) {
      Toast.error('加载详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleLike = () => {
    setLiked(!liked)
    Toast.success(liked ? '取消点赞' : '点赞成功')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.title,
        text: data?.description,
        url: window.location.href
      })
    } else {
      // 降级方案：复制链接
      navigator.clipboard.writeText(window.location.href)
      Toast.success('链接已复制到剪贴板')
    }
  }

  const handleAddToItinerary = () => {
    Toast.success('已添加到行程')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <div>加载中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.error}>
        <div className={styles.errorIcon}>😕</div>
        <div>内容不存在</div>
        <GradientButton variant="secondary" size="medium" onClick={handleBack}>
          返回
        </GradientButton>
      </div>
    )
  }

  return (
    <div className={styles.detail}>
      {/* 顶部导航 */}
      <div className={styles.header}>
        <IconButton
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          }
          variant="glass"
          size="medium"
          onClick={handleBack}
          ariaLabel="返回"
        />
        <div className={styles.actions}>
          <IconButton
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
            }
            variant="glass"
            size="medium"
            onClick={handleShare}
            ariaLabel="分享"
          />
          <IconButton
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            }
            variant={liked ? 'primary' : 'glass'}
            size="medium"
            onClick={handleLike}
            ariaLabel="点赞"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 图片轮播 */}
        <div className={styles.imageContainer}>
          <img
            src={data.images[0]}
            alt={data.title}
            className={styles.mainImage}
          />
        </div>

        {/* 文章信息 */}
        <div className={styles.articleInfo}>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{data.author}</span>
            <span className={styles.publishTime}>{data.publishTime}</span>
            <span className={styles.likes}>❤️ {data.likes}</span>
          </div>
          <div className={styles.tags}>
            {data.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 文章内容 */}
        <div className={styles.articleContent}>
          <div className={styles.markdown}>
            {data.content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index}>{line.substring(2)}</h1>
              } else if (line.startsWith('## ')) {
                return <h2 key={index}>{line.substring(3)}</h2>
              } else if (line.startsWith('### ')) {
                return <h3 key={index}>{line.substring(4)}</h3>
              } else if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.*?)\*\*：(.*)/)
                if (match) {
                  return (
                    <div key={index} className={styles.listItem}>
                      <strong>{match[1]}</strong>：{match[2]}
                    </div>
                  )
                }
              } else if (line.trim()) {
                return <p key={index}>{line}</p>
              }
              return <br key={index} />
            })}
          </div>
        </div>

        {/* 位置信息 */}
        <div className={styles.locationInfo}>
          <h3>📍 位置信息</h3>
          <div className={styles.location}>
            <div className={styles.locationName}>{data.location.name}</div>
            <div className={styles.locationAddress}>
              {data.location.address}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className={styles.bottomActions}>
        <GradientButton
          variant="primary"
          size="large"
          onClick={handleAddToItinerary}
          style={{ width: '100%' }}
        >
          添加到行程
        </GradientButton>
      </div>
    </div>
  )
}

export default Detail
