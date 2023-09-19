import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Image from "next/image";

export default function StandardImageList({
  itemData,
}: {
  itemData: Array<any>;
}) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={2} rowHeight={164}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <Image
            src={item.url}
            alt={item.title}
            width={500}
            height={500}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
