<template>
  <div class="home-container">
    <div class="header">
      <h1>格子鋪管理系統</h1>
      <p class="subtitle">GridPos Management System</p>
    </div>

    <div class="menu-grid">
      <router-link to="/checkout" class="menu-card">
        <div class="menu-icon">🛒</div>
        <h2>結帳掃描</h2>
        <p>掃描 QR Code 進行結帳</p>
      </router-link>

      <div class="menu-card disabled">
        <div class="menu-icon">📦</div>
        <h2>庫存管理</h2>
        <p>即將推出</p>
      </div>

      <div class="menu-card disabled">
        <div class="menu-icon">📊</div>
        <h2>營業報表</h2>
        <p>即將推出</p>
      </div>

      <div class="menu-card disabled">
        <div class="menu-icon">👥</div>
        <h2>格主管理</h2>
        <p>即將推出</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 格子鋪管理系統</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding-top: 40px;
}

.header h1 {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  letter-spacing: 1px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

.menu-card {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.menu-card:not(.disabled):hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.menu-card:not(.disabled):active {
  transform: translateY(-2px);
}

.menu-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.menu-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.menu-card h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.menu-card p {
  font-size: 14px;
  margin: 0;
  color: #6b7280;
}

.footer {
  text-align: center;
  color: white;
  padding: 20px 0;
  margin-top: 40px;
  font-size: 14px;
  opacity: 0.8;
}

.footer p {
  margin: 0;
}

@media (max-width: 640px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .menu-card {
    padding: 20px 15px;
    min-height: 150px;
  }

  .menu-icon {
    font-size: 36px;
  }

  .menu-card h2 {
    font-size: 16px;
  }

  .menu-card p {
    font-size: 12px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>
