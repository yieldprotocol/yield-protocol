export default {
  name: "about",
  title: "About page",
  type: "document",
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ["update", "publish", "create", "delete"],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "image",
      title: "Main image",
      type: "mainImage"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "careers",
      title: "Show careers",
      type: "boolean"
    },
    {
      name: "careersCTA",
      title: "Carers CTA text",
      type: "string"
    },
    {
      name: "careersDest",
      title: "Carers destination (default: /careers)",
      type: "string"
    }
  ]
};
