export default {
  name: "value",
  title: "Value",
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
      name: "description",
      title: "Description (optional)",
      type: "blockText"
    },
    {
      name: "image",
      title: "Icon or image (optional)",
      type: "mainImage"
    }
  ],
  preview: {
    select: {
      title: "title",
      image: "mainImage"
    },
    prepare({ title = "No title", image }) {
      return {
        title,
        media: image
      };
    }
  }
};
