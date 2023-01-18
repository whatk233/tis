export default {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="TIS" />
      <meta property="og:description" content="Tweak windows In Sysprep" />
      {process.env.UMAMI_URL && process.env.UMAMI_ID
        ? (
          <script
            async
            defer
            data-website-id={process.env.U_ID}
            src={process.env.U_URL}
          >
          </script>
        )
        : <></>}
    </>
  ),
  footer: {
    text: (
      <div>
        <span style={{ display: "block" }}>
          Made with ❤️ by <a href="https://whatk.me">Whatk</a>
        </span>
        <span style={{ display: "block", fontSize: "8px", margin: "10px 0" }}>
          Copyright © {new Date().getFullYear()}{" "}
          <a href="https://github.com/whatk233/tis" target="_blank">
            Whatk
          </a>
        </span>
      </div>
    ),
  },
  logo: <span style={{ fontSize: "28px", fontWeight: "bold" }}>TIS</span>,
  project: {
    link: "https://github.com/whatk233/tis",
  },
  docsRepositoryBase: "https://github.com/whatk233/tis/docs/pages",
  useNextSeoProps() {
    return {
      titleTemplate: "%s – TIS",
    };
  },
  i18n: [
    { locale: "en", text: "English" },
    { locale: "zh", text: "中文" },
  ],
};
