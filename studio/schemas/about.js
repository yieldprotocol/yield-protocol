export default {
  name: "about",
  title: "About page",
  type: "document",
  liveEdit: false,
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
