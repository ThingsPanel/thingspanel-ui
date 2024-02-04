/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = 'super' | 'admin' | 'user'

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string
    /** 用户名 */
    userName: string
    /** 用户角色类型 */
    userRole: RoleType
  }
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {}

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['gender']>

  /**
   * 用户状态
   * - N: 正常
   * - F: 冻结
   */
  type UserStatusKey = NonNullable<User['status']>
}

/**
 * 规则引擎模块
 */
declare namespace RuleEngine {
  interface Rule extends ApiRuleEngine.Rule {
    /** 序号 */
    index: number
  }

  /**
   * 规则引擎状态
   * - 1: 已启用
   * - 2: 已暂停
   */
  type StatusKey = NonNullable<Rule['status']>
}

/**
 * 数据服务模块
 */
declare namespace DataService {
  interface Data extends ApiDataService.Data {
    /** 序号 */
    index: number
    /** SQL */
    SQL: string | null
    /** SQL编写辅助 */
    SQLWritingAid: string | null
  }

  /**
   * 签名方式
   * - 1: MD5
   * - 2: HAS256
   */
  type SignModeKey = NonNullable<Data['signMode']>

  /**
   * 接口支持标志
   * - 1: http接口
   * - 2: http和ws接口
   */
  type FlagKey = NonNullable<Data['flag']>

  /**
   * 规则引擎状态
   * - 1: 已启用
   * - 2: 已停止
   */
  type StatusKey = NonNullable<Data['status']>
}

/**
 * 应用管理-服务管理模块
 */
declare namespace ServiceManagement {
  interface Service extends ApiApplyManagement.Service {
    /** 序号 */
    index: number
  }
  /**
   * 服务类别
   * - 1: 接入协议
   * - 2: 通知服务
   * - 3: 接入服务
   */
  type ServiceTypeKey = NonNullable<Service['serviceType']>
  /**
   * 服务状态
   * - 1: 运行中
   * - 2: 已停止
   */
  type StatusKey = NonNullable<Service['status']>
}

/**
 * 常规设置
 */
declare namespace GeneralSetting {
  interface ThemeSetting extends ApiGeneralSetting.ThemeSetting {}
  interface DataClearSetting extends ApiGeneralSetting.DataClearSetting {}

  /**
   * 清理类型
   * - 1: 操作日志
   * - 2: 设备数据
   */
  type CleanupTypeKey = NonNullable<DataClearSetting['cleanup_type']>
}

/**
 * 自定义路由类型 用于权限管理模块
 */
declare namespace CustomRoute {
  interface Route extends ApiCustomRoute.Route {}

  /**
   * 清理类型
   * - 1: 菜单
   * - 2: 目录
   * - 3: 路由
   * - 4: 按钮
   */
  type routerTypeKey = NonNullable<Route['element_type']>

  /**
   * 清理类型
   * - 1: 租户
   * - 2: 系统管理员
   */
  type routerSysFlagKey = string
}
