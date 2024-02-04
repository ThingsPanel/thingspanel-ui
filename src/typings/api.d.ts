// 后端接口返回的数据类型
declare namespace BaseApi {
  /** 后端返回的路由数据类型 */
  interface Data {
    code: number
    message: string
  }
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[]
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey
  }
}

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    token: string
    refreshToken: string
  }
  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[]
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey
  }
}

declare namespace ApiUserManagement {
  interface User {
    /** 用户id */
    id: string
    /** 用户邮箱 */
    email: string | null
    /** 用户名 */
    name: string | null
    /** 用户手机号码 */
    phone_number: string
    /**
     * 用户状态
     * - N: 正常
     * - F: 冻结
     */
    status: 'F' | 'N' | null
    /**
     * 用户性别
     * - 0: 女
     * - 1: 男
     */
    gender: '0' | '1' | null

    /** 备注 */
    remark: string | null
    /** 创建时间 */
    createTime: string | null
  }

  interface Data {
    list: User[]
    total: number
  }
}

/** 规则引擎 */
declare namespace ApiRuleEngine {
  interface Rule {
    /** id */
    id: string
    /** 规则名 */
    name: string | null
    /**
     * 规则状态
     * - 1: 已启动
     * - 2: 已暂停
     */
    status: '1' | '2' | null
  }
}

declare namespace ApiDataService {
  interface Data {
    /** id */
    id: string
    /** 规则名 */
    name: string | null
    /** app_key */
    appKey: string | null
    /** 签名方式 */
    signMode: string | null
    /** IP白名单 */
    ip: string | null
    /** 接口支持标志 */
    flag: string | null
    /** 推送数据间隔 */
    dataInterval: string | null
    /** 描述 */
    desc: string | null
    /** 创建时间 */
    createTime: string | null
    /**
     * 规则状态
     * - 1: 已启动
     * - 2: 已停止
     */
    status: '1' | '2' | null
  }
}

declare namespace ApiApplyManagement {
  interface Service {
    /** id */
    id: string
    /** 服务名称 */
    name: string | null
    /** 服务类别 */
    serviceType: string | null
    /** 介绍 */
    desc: string | null
    /** 作者 */
    author: string | null
    /** 版本 */
    version: string | null
    /**
     * 规则状态
     * - 1: 已启动
     * - 2: 已停止
     */
    status: '1' | '2' | null
  }
}

/**
 * 常规设置
 */
declare namespace ApiGeneralSetting {
  /** 主题设置 */
  interface ThemeSetting {
    /** id */
    id: string
    /** 系统标题 */
    system_name: string | null
    /** 首页和后台 logo */
    logo_one: string | undefined
    /** 加载页面 logo */
    logo_two: string | undefined
    /** 站标 logo */
    logo_three: string | undefined
    /** 背景图片 */
    home_background: string | undefined
  }
  /** 数据清理设置 */
  interface DataClearSetting {
    /** id */
    id: string
    /** 清理类型 */
    cleanup_type: string
    /** 保留天数 */
    retention_days: number
    /** 上次清理时间 */
    last_cleanup_time: string | null
    /** 上次清理数据时间节点 */
    last_cleanup_data_time: string | null
    /** 备注 */
    remark: string | null
  }
}

/**
 * 系统设置-路由管理
 */
declare namespace ApiCustomRoute {
  interface Route {
    /** id */
    id: string
    /** 父节点ID */
    parent_id: string
    /** 标题 */
    title: string
    /** 国际化 */
    i18nTitle: I18nType.I18nKey
    /** 图标 */
    icon: string
    /** 组件名称 */
    name: string
    /** 组件路径 */
    path: string
    /** 组件类型 */
    component: AuthRoute.RouteComponentType
    /** 排序 */
    orders: number
    /** 类型 */
    element_type: '1' | '2' | '3' | '4'
    /** 访问标识 */
    authority: any
    /** 描述 */
    description: string
    /** 子节点 */
    children: []
  }

  interface Data {
    list: Route[]
    total: number
  }
}
