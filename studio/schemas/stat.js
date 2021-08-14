export default {
  name: "stat",
  title: "Stat",
  type: "document",
  liveEdit: false,
  fields: [
    {
      name: "stat",
      title: "Stat or larger heading",
      type: "string"
    },
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "description",
      title: "Description (optional)",
      type: "text"
    },
    {
      name: "url",
      title: "URL (optional)",
      type: "url"
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
      subtitle: "description",
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
