export default {
  name: "value",
  title: "Value",
  type: "document",
  liveEdit: false,
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
