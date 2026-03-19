import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, initials } from '../../components/Manage/Shared';
import { AccountForm, emptyAccount } from './AccountForm';
import { AccountActions } from './AccountActions';
import { AccountGridItem } from './AccountGridItem';
import { AccountImportExport } from './AccountImportExport';
import './Accounts.css';

export const AccountsPage = () => <SimplePage
            title="Tài khoản" icon={Ico.account}
            subtitle={(l) => `${l.filter(x => !x.KHOA_TK).length} đang hoạt động · ${l.length} tổng`}
            emptyTitle="Chưa có tài khoản" emptyDesc="Tài khoản được tạo từ hệ thống"
            cols={['Tên đăng nhập', 'Email', 'Nhân viên', 'Trạng thái']}
            apiEndpoint="/accounts"
            primaryKey="SOTK"
            emptyForm={emptyAccount}
            renderToolbarActions={(fetchData, addToast, list) => (
                <AccountImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang hoạt động', filter: (x) => !x.KHOA_TK },
                { id: 'locked', label: 'Bị khóa', filter: (x) => x.KHOA_TK },
            ]}
            renderRow={(item, i) => [
                <td key="1">
                    <div className="cell-entity">
                        <div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(item.TENTK || 'TK')}</div>
                        <div className="entity-name">{item.TENTK}</div>
                    </div>
                </td>,
                <td key="2" style={{ color: 'var(--cyan)', fontSize: 12.5 }}>{item.EMAIL || '—'}</td>,
                <td key="3" style={{ color: 'var(--text-muted)' }}>{item.NHANVIEN?.TENNV || '—'}</td>,
                <td key="4">
                    <span className={item.KHOA_TK ? 'badge badge-inactive' : 'badge badge-active'}>
                        {item.KHOA_TK ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                </td>,
            ]}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <AccountActions 
                    item={item} openEdit={openEdit} del={del} 
                    list={list} setList={setList} addToast={addToast} 
                    openView={openView}
                />
            )}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <AccountGridItem 
                    item={item} openEdit={openEdit} del={del} idx={i} 
                    list={list} setList={setList} addToast={addToast} 
                    openView={openView}
                />
            )}
            renderForm={(form, hc, setForm) => <AccountForm form={form} hc={hc} setForm={setForm} />}
        />;


