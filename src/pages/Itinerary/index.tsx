import { useState, useEffect } from 'react'
import {
  Button,
  Input,
  Loading,
  Toast,
  Popup,
  Cell,
  SwipeCell
} from 'react-vant'
import {
  Plus,
  LocationO,
  Clock,
  Delete,
  Edit,
  Star,
  UserO
} from '@react-vant/icons'
import { useTitle } from '@/hooks/useTitle'
import { useItineraryStore } from '@/store/useItineraryStore'
import { useUserStore } from '@/store/useUserStore'
import type {
  Itinerary as ItineraryType,
  ItineraryItem
} from '@/store/useItineraryStore'
import styles from './itinerary.module.styl'

const Itinerary = () => {
  useTitle('我的行程 - 旅行助手')

  const { isLoggedIn } = useUserStore()
  const {
    itineraries,
    currentItinerary,
    loading,
    error,
    getItineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    setCurrentItinerary,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    duplicateItinerary,
    shareItinerary,
    clearError
  } = useItineraryStore()

  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showItemPopup, setShowItemPopup] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState<'start' | 'end'>('start')

  const [selectedItinerary, setSelectedItinerary] =
    useState<ItineraryType | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    tags: [] as string[]
  })

  const [itemFormData, setItemFormData] = useState({
    name: '',
    address: '',
    type: 'attraction' as ItineraryItem['type'],
    duration: 60,
    startTime: '',
    notes: ''
  })

  // 初始化数据
  useEffect(() => {
    getItineraries()
  }, [getItineraries])

  // 清除错误
  useEffect(() => {
    if (error) {
      Toast.fail(error)
      clearError()
    }
  }, [error, clearError])

  // 创建新行程
  const handleCreateItinerary = async () => {
    if (!formData.title.trim()) {
      Toast.info('请输入行程标题')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      Toast.info('请选择出行日期')
      return
    }

    try {
      await createItinerary({
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        items: [],
        isPublic: false,
        tags: formData.tags
      })

      Toast.success('行程创建成功')
      setShowCreatePopup(false)
      resetForm()
    } catch (error) {
      Toast.fail('创建失败，请重试')
    }
  }

  // 编辑行程
  const handleEditItinerary = async () => {
    if (!selectedItinerary || !formData.title.trim()) {
      Toast.info('请输入行程标题')
      return
    }

    try {
      await updateItinerary(selectedItinerary.id, {
        title: formData.title,
        description: formData.description,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tags: formData.tags
      })

      Toast.success('行程更新成功')
      setShowEditPopup(false)
      resetForm()
    } catch (error) {
      Toast.fail('更新失败，请重试')
    }
  }

  // 删除行程
  const handleDeleteItinerary = async (itinerary: ItineraryType) => {
    try {
      await deleteItinerary(itinerary.id)
      Toast.success('行程已删除')
    } catch (error) {
      Toast.fail('删除失败，请重试')
    }
  }

  // 复制行程
  const handleDuplicateItinerary = async (itinerary: ItineraryType) => {
    try {
      await duplicateItinerary(itinerary.id)
      Toast.success('行程已复制')
    } catch (error) {
      Toast.fail('复制失败，请重试')
    }
  }

  // 分享行程
  const handleShareItinerary = async (itinerary: ItineraryType) => {
    try {
      const shareUrl = await shareItinerary(itinerary.id)

      // 复制到剪贴板
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        Toast.success('分享链接已复制到剪贴板')
      } else {
        Toast.success(`分享链接: ${shareUrl}`)
      }
    } catch (error) {
      Toast.fail('分享失败，请重试')
    }
  }

  // 添加行程项目
  const handleAddItem = async () => {
    if (!currentItinerary || !itemFormData.name.trim()) {
      Toast.info('请输入地点名称')
      return
    }

    try {
      await addItineraryItem(currentItinerary.id, {
        name: itemFormData.name,
        address: itemFormData.address,
        latitude: 0, // 这里应该从地图获取
        longitude: 0,
        type: itemFormData.type,
        duration: itemFormData.duration,
        startTime: itemFormData.startTime,
        notes: itemFormData.notes
      })

      Toast.success('地点已添加')
      setShowItemPopup(false)
      resetItemForm()
    } catch (error) {
      Toast.fail('添加失败，请重试')
    }
  }

  // 编辑行程项目
  const handleEditItem = async () => {
    if (!currentItinerary || !selectedItem || !itemFormData.name.trim()) {
      Toast.info('请输入地点名称')
      return
    }

    try {
      await updateItineraryItem(currentItinerary.id, selectedItem.id, {
        name: itemFormData.name,
        address: itemFormData.address,
        type: itemFormData.type,
        duration: itemFormData.duration,
        startTime: itemFormData.startTime,
        notes: itemFormData.notes
      })

      Toast.success('地点已更新')
      setShowItemPopup(false)
      resetItemForm()
    } catch (error) {
      Toast.fail('更新失败，请重试')
    }
  }

  // 删除行程项目
  const handleDeleteItem = async (item: ItineraryItem) => {
    if (!currentItinerary) return

    try {
      await removeItineraryItem(currentItinerary.id, item.id)
      Toast.success('地点已删除')
    } catch (error) {
      Toast.fail('删除失败，请重试')
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      destination: '',
      startDate: '',
      endDate: '',
      tags: []
    })
    setSelectedItinerary(null)
  }

  const resetItemForm = () => {
    setItemFormData({
      name: '',
      address: '',
      type: 'attraction',
      duration: 60,
      startTime: '',
      notes: ''
    })
    setSelectedItem(null)
  }

  // 打开创建弹窗
  const openCreatePopup = () => {
    resetForm()
    setShowCreatePopup(true)
  }

  // 打开编辑弹窗
  const openEditPopup = (itinerary: ItineraryType) => {
    setSelectedItinerary(itinerary)
    setFormData({
      title: itinerary.title,
      description: itinerary.description || '',
      destination: itinerary.destination,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      tags: itinerary.tags || []
    })
    setShowEditPopup(true)
  }

  // 打开添加项目弹窗
  const openAddItemPopup = () => {
    resetItemForm()
    setShowItemPopup(true)
  }

  // 打开编辑项目弹窗
  const openEditItemPopup = (item: ItineraryItem) => {
    setSelectedItem(item)
    setItemFormData({
      name: item.name,
      address: item.address,
      type: item.type,
      duration: item.duration,
      startTime: item.startTime || '',
      notes: item.notes || ''
    })
    setShowItemPopup(true)
  }

  // 选择行程
  const selectItinerary = (itinerary: ItineraryType) => {
    setCurrentItinerary(itinerary)
  }

  // 日期选择
  const handleDateChange = (value: Date) => {
    const dateString = value.toISOString().split('T')[0]
    setFormData((prev) => ({
      ...prev,
      [datePickerType === 'start' ? 'startDate' : 'endDate']: dateString
    }))
    setShowDatePicker(false)
  }

  // 获取行程天数
  const getDaysDiff = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  // 获取类型图标
  const getTypeIcon = (type: ItineraryItem['type']) => {
    const icons = {
      attraction: '🏛️',
      restaurant: '🍽️',
      hotel: '🏨',
      transport: '🚗',
      other: '📍'
    }
    return icons[type] || '📍'
  }

  // 获取类型名称
  const getTypeName = (type: ItineraryItem['type']) => {
    const names = {
      attraction: '景点',
      restaurant: '餐厅',
      hotel: '酒店',
      transport: '交通',
      other: '其他'
    }
    return names[type] || '其他'
  }

  // 操作选项
  const actionSheetActions = [
    { name: '编辑', key: 'edit' },
    { name: '复制', key: 'duplicate' },
    { name: '分享', key: 'share' },
    { name: '删除', key: 'delete', color: '#ff6b6b' }
  ]

  // 未登录状态显示登录提示
  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.loginRequired}>
          <div className={styles.loginIcon}>
            <UserO fontSize={80} />
          </div>
          <div className={styles.loginTitle}>需要登录</div>
          <div className={styles.loginDesc}>
            查看行程需要登录账户，请先登录后再访问
          </div>
          <Button
            type="primary"
            onClick={() => {
              // 跳转到个人中心页面进行登录
              window.location.href = '/user'
            }}
            className={styles.loginButton}
          >
            去登录
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading type="spinner" />
        <div className={styles.loadingText}>加载中...</div>
      </div>
    )
  }

  // 如果没有选中行程，显示行程列表
  if (!currentItinerary) {
    return (
      <div className={styles.container}>
        {/* 头部 */}
        <div className={styles.header}>
          <h1 className={styles.title}>我的行程</h1>
          <Button
            type="primary"
            size="small"
            onClick={openCreatePopup}
            className={styles.createButton}
          >
            <Plus /> 新建行程
          </Button>
        </div>

        {/* 行程列表 */}
        <div className={styles.itineraryList}>
          {itineraries.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✈️</div>
              <div className={styles.emptyTitle}>还没有行程</div>
              <div className={styles.emptyDesc}>创建你的第一个旅行计划吧</div>
              <Button
                type="primary"
                onClick={openCreatePopup}
                className={styles.emptyButton}
              >
                <Plus /> 创建行程
              </Button>
            </div>
          ) : (
            itineraries.map((itinerary) => (
              <SwipeCell
                key={itinerary.id}
                rightAction={
                  <div className={styles.swipeActions}>
                    <Button
                      type="primary"
                      onClick={() => openEditPopup(itinerary)}
                      className={styles.swipeButton}
                    >
                      <Edit />
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => handleDeleteItinerary(itinerary)}
                      className={styles.swipeButton}
                    >
                      <Delete />
                    </Button>
                  </div>
                }
              >
                <div
                  className={styles.itineraryCard}
                  onClick={() => selectItinerary(itinerary)}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{itinerary.title}</h3>
                    <Button
                      size="mini"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedItinerary(itinerary)
                        setShowActionSheet(true)
                      }}
                      className={styles.moreButton}
                    >
                      ⋯
                    </Button>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.destination}>
                      <LocationO /> {itinerary.destination}
                    </span>
                    <span className={styles.duration}>
                      {getDaysDiff(itinerary.startDate, itinerary.endDate)}天
                    </span>
                  </div>

                  <div className={styles.cardDate}>
                    {itinerary.startDate} ~ {itinerary.endDate}
                  </div>

                  {itinerary.description && (
                    <div className={styles.cardDesc}>
                      {itinerary.description}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.itemCount}>
                      {itinerary.items.length} 个地点
                    </span>
                    {itinerary.tags && itinerary.tags.length > 0 && (
                      <div className={styles.tags}>
                        {itinerary.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SwipeCell>
            ))
          )}
        </div>

        {/* 创建行程弹窗 */}
        <Popup
          visible={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          position="bottom"
          round
          className={styles.formPopup}
        >
          <div className={styles.popupHeader}>
            <h2>创建新行程</h2>
          </div>

          <div className={styles.form}>
            <Cell title="行程标题" required>
              <Input
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                placeholder="输入行程标题"
              />
            </Cell>

            <Cell title="目的地">
              <Input
                value={formData.destination}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, destination: value }))
                }
                placeholder="输入目的地"
              />
            </Cell>

            <Cell
              title="开始日期"
              value={formData.startDate || '选择日期'}
              isLink
              onClick={() => {
                setDatePickerType('start')
                setShowDatePicker(true)
              }}
            />

            <Cell
              title="结束日期"
              value={formData.endDate || '选择日期'}
              isLink
              onClick={() => {
                setDatePickerType('end')
                setShowDatePicker(true)
              }}
            />

            <Cell title="行程描述">
              <Input
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="简单描述一下这次旅行"
              />
            </Cell>
          </div>

          <div className={styles.formActions}>
            <Button
              block
              type="primary"
              onClick={handleCreateItinerary}
              loading={loading}
            >
              创建行程
            </Button>
          </div>
        </Popup>

        {/* 编辑行程弹窗 */}
        <Popup
          visible={showEditPopup}
          onClose={() => setShowEditPopup(false)}
          position="bottom"
          round
          className={styles.formPopup}
        >
          <div className={styles.popupHeader}>
            <h2>编辑行程</h2>
          </div>

          <div className={styles.form}>
            <Cell title="行程标题" required>
              <Input
                value={formData.title}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, title: value }))
                }
                placeholder="输入行程标题"
              />
            </Cell>

            <Cell title="目的地">
              <Input
                value={formData.destination}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, destination: value }))
                }
                placeholder="输入目的地"
              />
            </Cell>

            <Cell
              title="开始日期"
              value={formData.startDate || '选择日期'}
              isLink
              onClick={() => {
                setDatePickerType('start')
                setShowDatePicker(true)
              }}
            />

            <Cell
              title="结束日期"
              value={formData.endDate || '选择日期'}
              isLink
              onClick={() => {
                setDatePickerType('end')
                setShowDatePicker(true)
              }}
            />

            <Cell title="行程描述">
              <Input
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value }))
                }
                placeholder="简单描述一下这次旅行"
              />
            </Cell>
          </div>

          <div className={styles.formActions}>
            <Button
              block
              type="primary"
              onClick={handleEditItinerary}
              loading={loading}
            >
              保存修改
            </Button>
          </div>
        </Popup>

        {/* 操作选择器 */}
        <Popup
          visible={showActionSheet}
          onClose={() => setShowActionSheet(false)}
          position="bottom"
          round
          className={styles.actionPopup}
        >
          <div className={styles.actionList}>
            <div className={styles.actionHeader}>选择操作</div>
            {actionSheetActions.map((action) => (
              <div
                key={action.key}
                className={styles.actionItem}
                style={{ color: action.color || '#333' }}
                onClick={() => {
                  if (!selectedItinerary) return

                  switch (action.name) {
                    case '编辑':
                      openEditPopup(selectedItinerary)
                      break
                    case '复制':
                      handleDuplicateItinerary(selectedItinerary)
                      break
                    case '分享':
                      handleShareItinerary(selectedItinerary)
                      break
                    case '删除':
                      handleDeleteItinerary(selectedItinerary)
                      break
                  }
                  setShowActionSheet(false)
                }}
              >
                {action.name}
              </div>
            ))}
            <div
              className={styles.actionCancel}
              onClick={() => setShowActionSheet(false)}
            >
              取消
            </div>
          </div>
        </Popup>

        {/* 日期选择器 */}
        <Popup
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          position="bottom"
          round
        >
          <div style={{ padding: '20px' }}>
            <h3>选择{datePickerType === 'start' ? '开始' : '结束'}日期</h3>
            <input
              type="date"
              value={
                datePickerType === 'start'
                  ? formData.startDate
                  : formData.endDate
              }
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #eee',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <Button onClick={() => setShowDatePicker(false)}>取消</Button>
              <Button type="primary" onClick={() => setShowDatePicker(false)}>
                确定
              </Button>
            </div>
          </div>
        </Popup>
      </div>
    )
  }

  // 显示行程详情
  return (
    <div className={styles.container}>
      {/* 行程详情头部 */}
      <div className={styles.detailHeader}>
        <Button
          size="small"
          onClick={() => setCurrentItinerary(null)}
          className={styles.backButton}
        >
          ← 返回
        </Button>

        <div className={styles.detailTitle}>
          <h1>{currentItinerary.title}</h1>
          <div className={styles.detailMeta}>
            <span className={styles.destination}>
              <LocationO /> {currentItinerary.destination}
            </span>
            <span className={styles.duration}>
              {getDaysDiff(
                currentItinerary.startDate,
                currentItinerary.endDate
              )}
              天
            </span>
          </div>
          <div className={styles.detailDate}>
            {currentItinerary.startDate} ~ {currentItinerary.endDate}
          </div>
        </div>

        <Button
          type="primary"
          size="small"
          onClick={openAddItemPopup}
          className={styles.addButton}
        >
          <Plus />
        </Button>
      </div>

      {/* 行程项目列表 */}
      <div className={styles.itemList}>
        {currentItinerary.items.length === 0 ? (
          <div className={styles.emptyItems}>
            <div className={styles.emptyIcon}>📍</div>
            <div className={styles.emptyTitle}>还没有添加地点</div>
            <div className={styles.emptyDesc}>从地图添加或手动创建地点</div>
            <Button
              type="primary"
              onClick={openAddItemPopup}
              className={styles.emptyButton}
            >
              <Plus /> 添加地点
            </Button>
          </div>
        ) : (
          currentItinerary.items.map((item, index) => (
            <SwipeCell
              key={item.id}
              rightAction={
                <div className={styles.swipeActions}>
                  <Button
                    type="primary"
                    onClick={() => openEditItemPopup(item)}
                    className={styles.swipeButton}
                  >
                    <Edit />
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => handleDeleteItem(item)}
                    className={styles.swipeButton}
                  >
                    <Delete />
                  </Button>
                </div>
              }
            >
              <div className={styles.itemCard}>
                <div className={styles.itemIndex}>{index + 1}</div>

                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemType}>
                      {getTypeIcon(item.type)}
                    </span>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    {item.rating && (
                      <span className={styles.itemRating}>
                        <Star /> {Number(item.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  {item.address && (
                    <div className={styles.itemAddress}>
                      <LocationO /> {item.address}
                    </div>
                  )}

                  <div className={styles.itemMeta}>
                    <span className={styles.itemDuration}>
                      <Clock /> {item.duration}分钟
                    </span>
                    {item.startTime && (
                      <span className={styles.itemTime}>{item.startTime}</span>
                    )}
                    <span className={styles.itemTypeText}>
                      {getTypeName(item.type)}
                    </span>
                  </div>

                  {item.notes && (
                    <div className={styles.itemNotes}>{item.notes}</div>
                  )}
                </div>
              </div>
            </SwipeCell>
          ))
        )}
      </div>

      {/* 添加/编辑项目弹窗 */}
      <Popup
        visible={showItemPopup}
        onClose={() => setShowItemPopup(false)}
        position="bottom"
        round
        className={styles.formPopup}
      >
        <div className={styles.popupHeader}>
          <h2>{selectedItem ? '编辑地点' : '添加地点'}</h2>
        </div>

        <div className={styles.form}>
          <Cell title="地点名称" required>
            <Input
              value={itemFormData.name}
              onChange={(value) =>
                setItemFormData((prev) => ({ ...prev, name: value }))
              }
              placeholder="输入地点名称"
            />
          </Cell>

          <Cell title="地址">
            <Input
              value={itemFormData.address}
              onChange={(value) =>
                setItemFormData((prev) => ({ ...prev, address: value }))
              }
              placeholder="输入详细地址"
            />
          </Cell>

          <Cell title="类型" value={getTypeName(itemFormData.type)} isLink>
            {/* 这里可以添加类型选择器 */}
          </Cell>

          <Cell title="停留时间">
            <Input
              type="number"
              value={itemFormData.duration.toString()}
              onChange={(value) =>
                setItemFormData((prev) => ({
                  ...prev,
                  duration: parseInt(value) || 60
                }))
              }
              placeholder="分钟"
            />
          </Cell>

          <Cell title="开始时间">
            <Input
              value={itemFormData.startTime}
              onChange={(value) =>
                setItemFormData((prev) => ({ ...prev, startTime: value }))
              }
              placeholder="如：09:00"
            />
          </Cell>

          <Cell title="备注">
            <Input
              value={itemFormData.notes}
              onChange={(value) =>
                setItemFormData((prev) => ({ ...prev, notes: value }))
              }
              placeholder="添加备注信息"
            />
          </Cell>
        </div>

        <div className={styles.formActions}>
          <Button
            block
            type="primary"
            onClick={selectedItem ? handleEditItem : handleAddItem}
            loading={loading}
          >
            {selectedItem ? '保存修改' : '添加地点'}
          </Button>
        </div>
      </Popup>
    </div>
  )
}

export default Itinerary
