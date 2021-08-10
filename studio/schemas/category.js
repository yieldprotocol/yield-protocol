import { MdApps } from "react-icons/md";

export default {
  name: "category",
  title: "Category",
  type: "document",
  icon: MdApps,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Set a slug to filter by later",
      options: {
        source: "title",
        maxLength: 96
      }
    },
    {
      name: "description",
      title: "Description",
      type: "text"
    }
  ],
  liveEdit: true
};
