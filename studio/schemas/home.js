export default {
  name: "home",
  title: "Home page",
  type: "document",
  liveEdit: false,
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
      type: "text"
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
      name: "borrowersText",
      title: "For borrowers",
      type: "array",
      of: [{ type: "stat" }]
    },
    {
      name: "lendersText",
      title: "For lenders",
      type: "array",
      of: [{ type: "stat" }]
    },
    {
      name: "backersHeading",
      title: "Backers heading",
      type: "string"
    },
    {
      name: "backers",
      title: "Backers",
      type: "array",
      of: [{ type: "image" }]
    },
  ]
};
