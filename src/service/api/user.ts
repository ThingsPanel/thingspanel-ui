import { request } from '../request_demo'

/** 获取用户列表 */
export const fetchUserList = async (params: any) => {
  const data = await request.get<ApiUserManagement.Data | null>('/user', {
    params
  })
  return data
}

/** 添加用户 */
export const addUser = async (params: any) => {
  const data = await request.post<BaseApi.Data>('/user', params)
  return data
}

/** 编辑用户 */
export const editUser = async (params: any) => {
  const data = await request.put<BaseApi.Data>('/user', params)
  return data
}

/** 删除用户 */
export const delUser = async (id: string) => {
  const data = await request.delete<BaseApi.Data>(`/user/${id}`)
  return data
}
