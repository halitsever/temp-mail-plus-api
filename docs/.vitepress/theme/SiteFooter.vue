<template>
  <footer class="site-footer">
    <div class="site-footer-stripe" aria-hidden="true"></div>
    <div class="site-footer-body">
      <p class="site-footer-note">
        Unofficial community project. Not affiliated with or endorsed by Temp Mail Plus.
      </p>
      <p class="site-footer-meta">
        MIT License. Made by <a href="https://halit.org">Halit Sever</a>.
        Source on <a href="https://github.com/halitsever/temp-mail-plus-api">GitHub</a>,
        package on <a href="https://www.npmjs.com/package/temp-mail-plus-api">npm</a>.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 64px;
}
.site-footer-stripe {
  height: 6px;
  background: repeating-linear-gradient(
    -45deg,
    var(--air-red) 0 14px,
    transparent 14px 28px,
    var(--air-blue) 28px 42px,
    transparent 42px 56px
  );
}
.site-footer-body {
  padding: 20px 0 8px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.site-footer-note {
  margin: 0 0 4px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.site-footer-meta {
  margin: 0;
}
.site-footer a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
