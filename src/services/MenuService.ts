import { injectable } from 'inversify';
import { Observable, of } from 'rxjs';
import { MenuItem } from '@/interfaces';

@injectable()
export class MenuService {
  public getMenus = (): Observable<MenuItem[]> => {
    return of([
      {
        key: 'dashboard',
        icon: 'dashboard',
        title: 'Dashboard',
        children: [
          {key: 'page-analyze', title: '分析页', link: ''},
          {key: 'page-monitor', title: '监控页'},
          {key: 'page-workspace', title: '工作台'},
        ],
      },
      {
        key: 'form',
        icon: 'form',
        title: '表单页',
        children: [
          {key: 'page-form-base', title: '基础表单'},
          {key: 'page-form-step', title: '分步表单'},
          {key: 'page-form-advance', title: '高级表单'},
        ],
      },
      {
        key: 'list',
        icon: 'table',
        title: '列表页',
        children: [
          {key: 'page-list-query', title: '查询列表'},
          {key: 'page-list-standard', title: '标准列表'},
          {key: 'page-list-card', title: '卡片列表'},
          {
            key: 'page-list-search',
            title: '搜索列表',
            children: [
              {key: 'page-list-serach-1', title: '搜索列表（文章）'},
              {key: 'page-list-search-2', title: '搜索列表（项目）'},
              {key: 'page-list-search-3', title: '搜索列表（应用）'},
            ],
          },
        ],
      },
      {
        key: 'detail',
        icon: 'profile',
        title: '详情页',
        children: [
          {key: 'page-detail-basic', title: '基础详情页'},
          {key: 'page-detail-advance', title: '高级详情页'},
        ],
      },
      {
        key: 'result',
        icon: 'check-circle',
        title: '结果页',
        children: [
          {key: 'page-result-success', title: '成功页'},
          {key: 'page-result-failure', title: '失败页'},
        ],
      },
      {
        key: 'error',
        icon: 'warning',
        title: '异常页',
        children: [
          {key: 'page-error-403', title: '403'},
          {key: 'page-error-404', title: '404'},
          {key: 'page-error-500', title: '500'},
        ],
      },
      {
        key: 'user',
        icon: 'user',
        title: '个人页',
        children: [
          {key: 'page-user-center', title: '个人中心'},
          {key: 'page-user-setting', title: '个人设置'},
        ],
      },
    ]);
  };
}
