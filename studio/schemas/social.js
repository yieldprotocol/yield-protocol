export default {
  name: "social",
  title: "Social",
  type: "document",
  liveEdit: false,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "url",
      title: "URL",
      type: "url"
    },
    {
      name: "image",
      title: "Icon",
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
