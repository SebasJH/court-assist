<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">COURT\nASSIST</div>
      <nav class="nav">
        <router-link to="/oefeningen" class="nav-link" :class="$route.path.startsWith('/oefeningen')? 'active':''">Oefeningen</router-link>
        <router-link to="/trainingen" class="nav-link" :class="$route.path.startsWith('/trainingen')? 'active':''">Trainingen</router-link>
        <a class="nav-link">Plays</a>
        <a class="nav-link">Rotatieplanner</a>
      </nav>
      <div class="user-block">
        <button class="switch-btn">Switch sport</button>
        <div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:18px;background:#dbe6f0"></div><div>Sebas Hartman</div></div>
      </div>
    </aside>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default { name: 'App' }
</script>