import React, { useContext } from "react"
import { HEADER_HEIGHT } from "../constants"
import { CardVerso } from "./card"
import { GalleryContext } from "./gallery-provider"
import { View } from "./view"

export const Gallery = () => {
  const {
    galleryOpened,
    setGalleryOpened,
    tangrams,
    setSelectedTangram,
  } = useContext(GalleryContext)

  return (
    <View
      css={{
        position: "fixed",
        left: "0",
        top: HEADER_HEIGHT,
        transform: `translate3d(${galleryOpened ? 0 : "-100vw"}, 0, 0)`,
        transition: "transform .3s",
        width: "100vw",
        height: "100vh",
        background: "#ecf0f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "scroll",
      }}
      deps={[galleryOpened]}
    >
      {tangrams.length > 0 ? (
        <View
          css={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 180px)",
            gridColumnGap: 10,
            gridRowGap: 15,
            gridAutoRows: 220,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {tangrams.map((tangram, index) => (
            <CardVerso
              key={index}
              tangram={tangram}
              onClick={() => {
                setSelectedTangram(tangram.svg)
                setGalleryOpened(false)
              }}
            />
          ))}
        </View>
      ) : (
        <View>{"Aucun tangram dans la galerie"}</View>
      )}
    </View>
  )
}
