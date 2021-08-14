export default {
  name: "page",
  title: "Page",
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
    }
  ]
};
