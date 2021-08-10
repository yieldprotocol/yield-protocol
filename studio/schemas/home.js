export default {
  name: "home",
  title: "Home page",
  type: "document",
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ["update", "publish" /* "create", "delete" */],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "heading",
      title: "Heading",
      type: "string"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "audit",
      title: "Audit text",
      type: "blockContent"
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "mainImage"
    },
    {
      name: "ctaPrimary",
      title: "First CTA",
      type: "string"
    },
    {
      name: "ctaPrimaryURL",
      title: "First CTA link (goes to the /contact page by default)",
      type: "string"
    },
    {
      name: "ctaSecondary",
      title: "Secondary CTA (external link to Slack channel by default)",
      type: "string"
    },
    {
      name: "ctaSecondaryURL",
      title: "Secondary CTA link",
      type: "url"
    },
    {
      name: "stats",
      title: "Stats",
      type: "array",
      of: [{ type: "stat" }]
    },
    {
      name: "showBlog",
      title: "Show blog (enabled by default)",
      type: "boolean"
    },
    {
      name: "mainCTA",
      title: "CTA at bottom of page",
      type: "string"
    },
    {
      name: "mainCTAURL",
      title: "CTA destination (goes to /contact by default)",
      type: "string"
    }
  ]
};
