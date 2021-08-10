import S from "@sanity/desk-tool/structure-builder";
import { MdBusiness, MdSettings } from "react-icons/md";
import { FaFile } from "react-icons/fa";

const hiddenTypes = [
  "about",
  "career",
  "category",
  "companyInfo",
  "contact",
  "home",
  "mission",
  "page",
  "paper",
  "person",
  "post",
  "social",
  "stat",
  "stories",
  "story",
  "siteSettings",
  "value"
];

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        )
        .icon(MdSettings),
      S.listItem()
        .title("Company Info")
        .child(
          S.editor()
            .id("companyInfo")
            .schemaType("companyInfo")
            .documentId("companyInfo")
        )
        .icon(MdBusiness),
      S.listItem()
        .title("Blog Posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog Posts")),
      S.listItem()
        .title("White Papers")
        .schemaType("paper")
        .child(S.documentTypeList("paper").title("White Papers")),
      S.listItem()
        .title("Careers")
        .schemaType("career")
        .child(S.documentTypeList("career").title("Careers")),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home")
                .child(
                  S.editor()
                    .id("homePage")
                    .schemaType("home")
                    .documentId("home")
                )
                .icon(FaFile),
              S.listItem()
                .title("About")
                .child(
                  S.editor()
                    .id("aboutPage")
                    .schemaType("about")
                    .documentId("about")
                )
                .icon(FaFile),
              S.listItem()
                .title("Mission")
                .child(
                  S.editor()
                    .id("missionPage")
                    .schemaType("mission")
                    .documentId("mission")
                )
                .icon(FaFile),
              S.listItem()
                .title("Contact")
                .child(
                  S.editor()
                    .id("contactPage")
                    .schemaType("page")
                    .documentId("contact")
                )
                .icon(FaFile),
              S.listItem()
                .title("Careers")
                .child(
                  S.editor()
                    .id("careersPage")
                    .schemaType("page")
                    .documentId("careers")
                )
                .icon(FaFile),
              S.listItem()
                .title("Blog")
                .child(
                  S.editor()
                    .id("blogsPage")
                    .schemaType("page")
                    .documentId("blog")
                )
                .icon(FaFile),
              S.listItem()
                .title("Categories")
                .child(
                  S.editor()
                    .id("categoriesPage")
                    .schemaType("page")
                    .documentId("categories")
                )
                .icon(FaFile)
            ])
        ),
      S.listItem()
        .title("People")
        .schemaType("person")
        .child(S.documentTypeList("person").title("People")),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),
      ...S.documentTypeListItems().filter(listItem => !hiddenTypes.includes(listItem.getId()))
    ]);
