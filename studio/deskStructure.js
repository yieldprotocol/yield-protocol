import S from "@sanity/desk-tool/structure-builder";
import { MdBusiness, MdSettings } from "react-icons/md";
import { FaFile } from "react-icons/fa";

const hiddenTypes = [
  "about",
  "careers",
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
  "value",
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
        .title("General Pages")
        .schemaType("paper")
        .child(S.documentTypeList("page").title("General Pages")),
      S.listItem()
        .title("Custom Pages")
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
                .title("Careers")
                .child(
                  S.editor()
                    .id("careersPage")
                    .schemaType("careers")
                    .documentId("careers")
                )
                .icon(FaFile),
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
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenTypes.includes(listItem.getId())
      ),
    ]);
