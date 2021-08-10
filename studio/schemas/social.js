export default {
  name: "social",
  title: "Social",
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
