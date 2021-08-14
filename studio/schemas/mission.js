export default {
  name: "mission",
  title: "Mission page",
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
      name: "values",
      title: "Values",
      type: "array",
      of: [{ type: "value" }]
    },
  ]
};
