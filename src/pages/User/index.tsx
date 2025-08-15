import { useState, useEffect } from 'react'
import { Button, Dialog, Toast, Popup, Input, Cell } from 'react-vant'
import {
  UserO as UserIcon,
  LocationO as Location,
  Edit as SettingIcon
} from '@react-vant/icons'
import { useTitle } from '@/hooks/useTitle'
import { useUserStore } from '@/store/useUserStore'
import { useItineraryStore } from '@/store/useItineraryStore'
import { GradientButton, IconButton } from '@/components/Common'

import AvatarPreview from '@/components/AvatarPreview'
import styles from './user.module.styl'

const User = () => {
  useTitle('我的 - 旅行助手')

  const { user, isLoggedIn, login, logout } = useUserStore()
  const { itineraries } = useItineraryStore()

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [_showAbout, _setShowAbout] = useState(false)
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)
  const [showTopNav, setShowTopNav] = useState(false)

  // 表单状态
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })

  const [profileForm, setProfileForm] = useState({
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    location: user?.location || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: user?.birthday || '',
    gender: user?.gender || ''
  })

  // 统计数据
  const stats = {
    totalItineraries: itineraries.length,
    totalDays: itineraries.reduce((sum, itinerary) => {
      const start = new Date(itinerary.startDate)
      const end = new Date(itinerary.endDate)
      return (
        sum +
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1
      )
    }, 0),
    totalPlaces: itineraries.reduce(
      (sum, itinerary) => sum + itinerary.items.length,
      0
    ),
    followingCount: 3,
    followersCount: 128,
    likesCount: 256,
    favoriteCount: 12 // 添加收藏数量
  }

  // 滚动监听
  useEffect(() => {
    const containerElement = document.querySelector(`.${styles.container}`)
    if (!containerElement) return

    const handleScroll = () => {
      const scrollTop = containerElement.scrollTop
      const userSectionHeight = window.innerHeight * 0.58 // 58vh

      const userSection = document.querySelector(`.${styles.userSection}`)
      if (userSection) {
        if (scrollTop >= userSectionHeight) {
          userSection.classList.add(styles.scrolled)
          setShowTopNav(true)
        } else {
          userSection.classList.remove(styles.scrolled)
          setShowTopNav(false)
        }
      }
    }

    containerElement.addEventListener('scroll', handleScroll)
    return () => containerElement.removeEventListener('scroll', handleScroll)
  }, [])

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      Toast.info('请输入用户名和密码')
      return
    }

    try {
      await login({
        username: loginForm.username,
        password: loginForm.password,
        remember: true
      })
      Toast.success('登录成功')
      setShowLoginDialog(false)
      setLoginForm({ username: '', password: '' })
    } catch (error) {
      Toast.fail(
        error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
      )
    }
  }

  // 处理登出
  const handleLogout = () => {
    Dialog.confirm({
      title: '确认登出',
      message: '登出后将清除本地数据，确定要继续吗？'
    })
      .then(() => {
        logout()
        Toast.success('已登出')
      })
      .catch(() => {
        // 用户取消
      })
  }

  // 更新个人资料
  const handleUpdateProfile = async () => {
    try {
      // 这里应该调用用户store的更新方法
      // 暂时使用Toast提示
      Toast.success('资料更新成功')
      setShowEditProfile(false)
    } catch (error) {
      Toast.fail('更新失败，请重试')
    }
  }

  // 处理头像上传
  const handleAvatarUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          Toast.fail('图片大小不能超过5MB')
          return
        }
        if (!file.type.startsWith('image/')) {
          Toast.fail('请选择图片文件')
          return
        }
        const reader = new FileReader()
        reader.onload = () => {
          Toast.success('头像上传成功')
          setShowAvatarPreview(false)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // 头像相关功能
  const handleAvatarClick = () => setShowAvatarPreview(true)
  const handleCreateAIAvatar = () => {
    setShowAvatarPreview(false)
    Toast.info('AI头像制作功能开发中...')
  }
  const handleGetAvatarFrame = () => {
    setShowAvatarPreview(false)
    Toast.info('头像挂件功能开发中...')
  }

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 - 滚动时显示 */}
      {isLoggedIn && (
        <div
          className={`${styles.topNavBar} ${showTopNav ? styles.visible : ''}`}
        >
          <div className={styles.topNavAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt="头像" />
            ) : (
              <span>{user?.nickname?.[0] || '旅'}</span>
            )}
          </div>
          <div className={styles.topNavTitle}>
            {user?.nickname || '虚舟旅行者'}
          </div>
        </div>
      )}

      {/* 用户信息区域 */}
      <div className={styles.userSection}>
        {isLoggedIn ? (
          <div className={styles.userInfo}>
            {/* 个人资料区域 */}
            <div className={styles.profileSection}>
              <div
                className={styles.avatarContainer}
                onClick={handleAvatarClick}
              >
                <div className={styles.avatar}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="头像" />
                  ) : (
                    <span className={styles.avatarText}>
                      {user?.nickname?.[0] || '旅'}
                    </span>
                  )}
                </div>
                <div className={styles.addIcon}>+</div>
              </div>

              <div className={styles.userDetails}>
                <h2 className={styles.nickname}>
                  {user?.nickname || '虚舟旅行者'}
                </h2>

                {/* 用户信息行 - ID和地点并列在头像下方 */}
                <div className={styles.userInfoRow}>
                  <div className={styles.userId}>
                    虚舟ID：{user?.id || '001'}
                  </div>
                  {user?.location && (
                    <div className={styles.location}>
                      <Location /> {user.location}
                    </div>
                  )}
                </div>

                {user?.bio ? (
                  <p className={styles.bio}>{user.bio}</p>
                ) : (
                  <p className={styles.bio}>点击这里，填写简介</p>
                )}

                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.followingCount}
                    </div>
                    <div className={styles.statLabel}>关注</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>
                      {stats.followersCount}
                    </div>
                    <div className={styles.statLabel}>粉丝</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>{stats.likesCount}</div>
                    <div className={styles.statLabel}>获赞与收藏</div>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <GradientButton
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      setProfileForm({
                        nickname: user?.nickname || '',
                        bio: user?.bio || '',
                        location: user?.location || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        birthday: user?.birthday || '',
                        gender: user?.gender || ''
                      })
                      setShowEditProfile(true)
                    }}
                  >
                    编辑资料
                  </GradientButton>
                  <IconButton
                    icon={<SettingIcon />}
                    variant="ghost"
                    size="medium"
                    onClick={() => setShowSettings(true)}
                    ariaLabel="设置"
                  />
                </div>
              </div>
            </div>

            {/* 功能卡片区域 - 移动到用户信息区域内 */}
            <div className={styles.featureCards}>
              <div
                className={styles.featureCard}
                onClick={() => (window.location.href = '/itinerary')}
              >
                <div className={styles.cardIcon}>🗺️</div>
                <div className={styles.cardTitle}>我的行程</div>
                <div className={styles.cardDesc}>查看旅行计划</div>
                <div className={styles.cardBadge}>
                  {stats.totalItineraries}个待出发
                </div>
              </div>

              <div
                className={styles.featureCard}
                onClick={() => Toast.info('足迹功能开发中...')}
              >
                <div className={styles.cardIcon}>👣</div>
                <div className={styles.cardTitle}>旅行足迹</div>
                <div className={styles.cardDesc}>记录走过的路</div>
                <div className={styles.cardBadge}>
                  已去过{stats.totalPlaces}个地点
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            <div className={styles.defaultAvatar}>
              <UserIcon />
            </div>
            <div className={styles.loginText}>
              <h2>欢迎使用旅行助手</h2>
              <p>登录后享受更多个性化服务</p>
            </div>
            <GradientButton
              variant="primary"
              size="large"
              onClick={() => setShowLoginDialog(true)}
            >
              立即登录
            </GradientButton>
          </div>
        )}
      </div>

      {/* 底部内容区域 */}
      {isLoggedIn && (
        <div className={styles.contentSection}>
          {/* 标签页 */}
          <div className={styles.tabBar}>
            <div className={styles.tabItem}>
              <span className={styles.tabIcon}>📝</span>
              <span className={styles.tabText}>笔记</span>
            </div>
            <div className={styles.tabItem + ' ' + styles.active}>
              <span className={styles.tabIcon}>🔒</span>
              <span className={styles.tabText}>收藏</span>
            </div>
            <div className={styles.tabItem}>
              <span className={styles.tabIcon}>👍</span>
              <span className={styles.tabText}>赞过</span>
            </div>
            <div className={styles.searchIcon}>🔍</div>
          </div>

          {/* 内容统计 */}
          <div className={styles.contentStats}>
            <span className={styles.statsText}>
              🔒 收藏{stats.favoriteCount}
            </span>
            <span className={styles.statsText}>专辑 0</span>
          </div>

          {/* 内容网格 */}
          <div className={styles.contentGrid}>
            <div className={styles.contentItem}>
              <div className={styles.contentImage}>
                <div className={styles.placeholderImage}>
                  <span>🗺️</span>
                  <div className={styles.playIcon}>▶</div>
                </div>
              </div>
              <div className={styles.contentTitle}>我的旅行规划</div>
              <div className={styles.contentMeta}>
                <span className={styles.authorName}>虚舟</span>
                <span className={styles.likeCount}>❤️ {stats.totalPlaces}</span>
              </div>
            </div>

            <div className={styles.contentItem}>
              <div className={styles.contentImage}>
                <div className={styles.placeholderImage}>
                  <span>📸</span>
                  <div className={styles.playIcon}>▶</div>
                </div>
              </div>
              <div className={styles.contentTitle}>旅行回忆录</div>
              <div className={styles.contentMeta}>
                <span className={styles.authorName}>虚舟</span>
                <span className={styles.likeCount}>❤️ {stats.totalDays}</span>
              </div>
            </div>
          </div>

          {/* 退出登录按钮 */}
          <div className={styles.logoutSection}>
            <GradientButton
              variant="secondary"
              size="large"
              onClick={handleLogout}
              style={{ width: '100%' }}
            >
              退出登录
            </GradientButton>
          </div>
        </div>
      )}

      {/* 登录弹窗 */}
      <Popup
        visible={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        position="center"
        round
        className={styles.loginPopup}
      >
        <div className={styles.loginContainer}>
          {/* 登录头部 */}
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>登录</h2>
            <button
              className={styles.closeButton}
              onClick={() => setShowLoginDialog(false)}
            >
              ✕
            </button>
          </div>

          {/* 登录表单 */}
          <div className={styles.loginForm}>
            <Input
              value={loginForm.username}
              onChange={(value) =>
                setLoginForm((prev) => ({ ...prev, username: value }))
              }
              placeholder="用户名"
              className={styles.loginInput}
            />

            <Input
              type="password"
              value={loginForm.password}
              onChange={(value) =>
                setLoginForm((prev) => ({ ...prev, password: value }))
              }
              placeholder="密码"
              className={styles.loginInput}
            />

            <GradientButton
              variant="primary"
              size="large"
              onClick={handleLogin}
              style={{ width: '100%' }}
            >
              登录
            </GradientButton>

            {/* 演示提示 */}
            <div className={styles.demoTips}>
              <p>演示账号：demo / 123456</p>
            </div>
          </div>
        </div>
      </Popup>

      {/* 编辑资料弹窗 */}
      <Popup
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        position="bottom"
        round
        className={styles.editPopup}
      >
        <div className={styles.popupHeader}>
          <h3>编辑个人资料</h3>
        </div>
        <div className={styles.editForm}>
          <Cell title="昵称">
            <Input
              value={profileForm.nickname}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, nickname: value }))
              }
              placeholder="请输入昵称"
            />
          </Cell>
          <Cell title="个人简介">
            <Input.TextArea
              value={profileForm.bio}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, bio: value }))
              }
              placeholder="介绍一下自己吧"
              rows={3}
            />
          </Cell>
          <Cell title="所在地">
            <Input
              value={profileForm.location}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, location: value }))
              }
              placeholder="请输入所在地"
            />
          </Cell>
          <Cell title="邮箱">
            <Input
              value={profileForm.email}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, email: value }))
              }
              placeholder="请输入邮箱地址"
            />
          </Cell>
          <Cell title="手机号">
            <Input
              value={profileForm.phone}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, phone: value }))
              }
              placeholder="请输入手机号"
            />
          </Cell>
          <Cell title="生日">
            <Input
              value={profileForm.birthday}
              onChange={(value) =>
                setProfileForm((prev) => ({ ...prev, birthday: value }))
              }
              placeholder="请选择生日"
            />
          </Cell>
        </div>
        <div className={styles.editActions}>
          <GradientButton
            variant="primary"
            size="large"
            onClick={handleUpdateProfile}
            style={{ width: '100%' }}
          >
            保存修改
          </GradientButton>
        </div>
      </Popup>

      {/* 更多设置弹窗 */}
      <Popup
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        position="bottom"
        round
        className={styles.settingsPopup}
      >
        <div className={styles.popupHeader}>
          <h3>更多设置</h3>
        </div>
        <div className={styles.settingsList}>
          <Cell
            title="通知设置"
            icon={<span style={{ fontSize: '18px' }}>🔔</span>}
            isLink
            onClick={() => Toast.info('通知设置功能开发中...')}
          />
          <Cell
            title="隐私设置"
            icon={<span style={{ fontSize: '18px' }}>🔒</span>}
            isLink
            onClick={() => Toast.info('隐私设置功能开发中...')}
          />
          <Cell
            title="账号安全"
            icon={<span style={{ fontSize: '18px' }}>🛡️</span>}
            isLink
            onClick={() => Toast.info('账号安全功能开发中...')}
          />
          <Cell
            title="数据导出"
            icon={<span style={{ fontSize: '18px' }}>📤</span>}
            isLink
            onClick={() => Toast.info('数据导出功能开发中...')}
          />
          <Cell
            title="清除缓存"
            icon={<span style={{ fontSize: '18px' }}>🗑️</span>}
            isLink
            onClick={() => {
              Dialog.confirm({
                title: '清除缓存',
                message: '确定要清除所有缓存数据吗？'
              })
                .then(() => {
                  Toast.success('缓存清除成功')
                })
                .catch(() => {})
            }}
          />
          <Cell
            title="关于我们"
            icon={<span style={{ fontSize: '18px' }}>ℹ️</span>}
            isLink
            onClick={() => {
              setShowSettings(false)
              Toast.info('关于我们功能开发中...')
            }}
          />
        </div>
      </Popup>

      {/* 头像预览弹窗 */}
      <AvatarPreview
        visible={showAvatarPreview}
        onClose={() => setShowAvatarPreview(false)}
        avatarUrl={user?.avatar}
        onUploadNew={handleAvatarUpload}
        onCreateAI={handleCreateAIAvatar}
        onGetFrame={handleGetAvatarFrame}
      />
    </div>
  )
}

export default User
