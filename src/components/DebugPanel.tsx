'use client';
import { useState, useEffect } from 'react';
import { getAllUsers, getUserById, testConnection, User } from '@/lib/api';

interface DebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DebugPanel({ isVisible, onClose }: DebugPanelProps) {
  const [connectionStatus, setConnectionStatus] = useState<string>('테스트 중...');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      testBackendConnection();
      loadUsers();
    }
  }, [isVisible]);

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('연결 테스트 중...');
      await testConnection();
      setConnectionStatus('✅ 백엔드 연결 성공');
    } catch (error) {
      setConnectionStatus(`❌ 백엔드 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserById = async (id: number) => {
    try {
      setIsLoading(true);
      const user = await getUserById(id);
      setSelectedUser(user);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid #333',
        color: '#fff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #333',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0, color: '#00ff88' }}>🔧 백엔드 디버깅 패널</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ✕
          </button>
        </div>

        {/* 연결 상태 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>🔗 연결 상태</h3>
          <div style={{
            padding: '10px',
            backgroundColor: '#2a2a2a',
            borderRadius: '6px',
            border: '1px solid #333'
          }}>
            {connectionStatus}
          </div>
          <button
            onClick={testBackendConnection}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            재연결 테스트
          </button>
        </div>

        {/* 사용자 목록 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>👥 사용자 목록</h3>
          {isLoading ? (
            <div style={{ color: '#888' }}>로딩 중...</div>
          ) : users.length > 0 ? (
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              backgroundColor: '#2a2a2a',
              borderRadius: '6px',
              padding: '10px'
            }}>
              {users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '8px',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedUserId === user.id ? '#3a3a3a' : 'transparent'
                  }}
                  onClick={() => {
                    setSelectedUserId(user.id);
                    loadUserById(user.id);
                  }}
                >
                  <strong>ID: {user.id}</strong> | {user.loginId} | {user.teamName}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#888' }}>사용자가 없습니다.</div>
          )}
          <button
            onClick={loadUsers}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#0066ff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            사용자 목록 새로고침
          </button>
        </div>

        {/* 선택된 사용자 정보 */}
        {selectedUser && (
          <div>
            <h3 style={{ color: '#00ff88', marginBottom: '10px' }}>👤 선택된 사용자 정보</h3>
            <div style={{
              padding: '15px',
              backgroundColor: '#2a2a2a',
              borderRadius: '6px',
              border: '1px solid #333'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(selectedUser, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* 데이터베이스 오류 해결 가이드 */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '6px' }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>⚠️ 데이터베이스 오류 해결 가이드</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <p><strong>현재 오류:</strong> <code>column u1_0.id does not exist</code></p>
            <p><strong>해결 방법:</strong></p>
            <ol style={{ marginLeft: '20px' }}>
              <li>User 엔티티의 <code>@Table(name = "users")</code> 확인</li>
              <li><code>@Column(name = "team_name")</code> 어노테이션 확인</li>
              <li>데이터베이스 스키마와 엔티티 매핑 일치 확인</li>
              <li>JPA Repository 쿼리 수정</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 