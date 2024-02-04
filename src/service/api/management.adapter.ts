/**
 * 递归处理数据
 * @param treeNode
 * @param depth
 */
function processTree(treeNode: ApiCustomRoute.Route, depth: number = 0): void {
  // 处理当前节点
  treeNode.authority = treeNode.authority ? JSON.parse(treeNode.authority) : []
  // 递归处理子节点
  if (treeNode.children) {
    for (const childNode of treeNode.children) {
      processTree(childNode, depth + 1)
    }
  }
}

export function adapterOfFetchRouterList(data: ApiCustomRoute.Data | null): ApiCustomRoute.Route[] {
  if (!data?.list) return []
  return data.list.map(item => {
    processTree(item)
    return item
  })
}
