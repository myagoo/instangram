import paper from "paper/dist/paper-core"
import React, { useContext, useEffect, useLayoutEffect, useRef } from "react"
import { ThemeContext } from "styled-components"
import { GalleryContext } from "../components/gallery-provider"
import { View } from "../components/view"
import {
  LENGTH_MAX,
  LENGTH_MIN,
  OVERLAPING_OPACITY,
  SMALL_TRIANGLE_BASE,
} from "../constants"
import { useCreateTan } from "../hooks/useCreateTan"
import { useImportTan } from "../hooks/useImportTan"
import { getOffsettedPoints } from "../utils/get-offsetted-points"

function contains(item1, item2) {
  return item2.segments.every(segment => item1.contains(segment.point))
}

export const Tangram = () => {
  const theme = useContext(ThemeContext)
  const canvasRef = useRef()
  const groupsRef = useRef()
  const coumpoundPathRef = useRef()
  const { onSaveRequest, selectedTangram } = useContext(GalleryContext)
  const {
    createRhombusGroup,
    createSquareGroup,
    createTriangleGroup,
  } = useCreateTan()
  useImportTan(coumpoundPathRef, selectedTangram)

  useEffect(() => {
    if (onSaveRequest) {
      onSaveRequest(getCompoundPath())
    }
  }, [onSaveRequest])

  const getCompoundPath = () => {
    let compoundPath

    for (const group of groupsRef.current) {
      const path = group.firstChild
      const offsettedPath = new paper.Path({
        segments: getOffsettedPoints(
          path.segments.map(segment => path.localToGlobal(segment.point)),
          1
        ),
        closed: true,
        insert: false,
      })
      if (!compoundPath) {
        compoundPath = offsettedPath
      } else {
        compoundPath = compoundPath.unite(offsettedPath, { insert: false })
      }
    }

    compoundPath.fillRule = "evenodd"
    compoundPath.closed = true
    compoundPath.position = new paper.Point(
      compoundPath.bounds.width / 2,
      compoundPath.bounds.height / 2
    )

    const svg = compoundPath
      .exportSVG({ asString: true })
      .replace(/fill="none"/g, "")
    const width = compoundPath.bounds.width
    const height = compoundPath.bounds.height
    const length = Math.ceil(compoundPath.length)
    const percent = Math.floor(
      ((length - LENGTH_MIN) / (LENGTH_MAX - LENGTH_MIN)) * 100
    )

    compoundPath.remove()

    return {
      svg,
      width,
      height,
      percent,
    }
  }

  useLayoutEffect(() => {
    function init() {
      const parentRect = canvasRef.current.parentElement.getBoundingClientRect()
      canvasRef.current.width = parentRect.width
      canvasRef.current.height = parentRect.height

      // Create an empty project and a view for the canvas:
      paper.setup(canvasRef.current)
      setupPieces()
    }

    const checkForIntersections = group => {
      for (const group2 of groupsRef.current) {
        if (group2 === group) {
          continue
        }

        if (
          group.lastChild.intersects(group2.lastChild) ||
          contains(group.lastChild, group2.lastChild) ||
          contains(group2.lastChild, group.lastChild)
        ) {
          group.data.collisions.add(group2.data.id)
          group2.data.collisions.add(group.data.id)
        } else {
          group.data.collisions.delete(group2.data.id)
          group2.data.collisions.delete(group.data.id)
        }
      }

      for (const otherGroup of groupsRef.current) {
        if (otherGroup.data.collisions.size > 0) {
          otherGroup.firstChild.fillColor = theme.colors.collision
          otherGroup.firstChild.opacity = OVERLAPING_OPACITY
        } else {
          otherGroup.firstChild.fillColor = theme.colors[otherGroup.data.id]
          otherGroup.firstChild.opacity = 1
        }
      }
    }

    function attachEvents(group) {
      group.on("mousedown", () => group.bringToFront())

      group.on("mouseup", check)

      group.on("mousedrag", mdEvent => {
        const newX = group.position.x + mdEvent.delta.x
        const newY = group.position.y + mdEvent.delta.y

        const isOutsideCanvas =
          newX - group.bounds.width / 2 <= 0 ||
          newY - group.bounds.height / 2 <= 0 ||
          newX + group.bounds.width / 2 > canvasRef.current.offsetWidth ||
          newY + group.bounds.height / 2 > canvasRef.current.offsetHeight

        if (isOutsideCanvas) {
          return
        }

        group.position.x = newX
        group.position.y = newY

        checkForIntersections(group)
      })

      group.on("doubleclick", mdEvent => {
        group.rotation += 45
        checkForIntersections(group)
      })
    }

    function check() {
      if (!coumpoundPathRef.current) {
        return
      }
      let newCoumpoundPath = coumpoundPathRef.current

      for (const group of groupsRef.current) {
        if (group.data.collisions.size > 0) {
          return
        }
        newCoumpoundPath = newCoumpoundPath.unite(group.lastChild, {
          insert: false,
        })
      }
      if (newCoumpoundPath.length === coumpoundPathRef.current.length) {
        alert("YOU WIN MOTHERFUCKER")
      }
    }

    function setupPieces() {
      const smallBase = SMALL_TRIANGLE_BASE
      const mediumBase = Math.sqrt(Math.pow(smallBase, 2) * 2)
      const largeBase = Math.sqrt(Math.pow(mediumBase, 2) * 2)

      groupsRef.current = [
        createTriangleGroup(smallBase, "st1"),
        createTriangleGroup(smallBase, "st2"),
        createTriangleGroup(mediumBase, "mt1"),
        createTriangleGroup(largeBase, "lt1"),
        createTriangleGroup(largeBase, "lt2"),
        createSquareGroup(mediumBase, "sq"),
        createRhombusGroup(smallBase, "rh"),
      ]

      for (const group of groupsRef.current) {
        attachEvents(group)
        checkForIntersections(group)
      }
    }

    init()
  }, [createRhombusGroup, createSquareGroup, createTriangleGroup, theme.colors])

  return (
    <View
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
      background="#b7efe0"
    >
      <View width="50vw" height="80%" background="#fff">
        <View as="canvas" ref={canvasRef} flex="1" />
      </View>
    </View>
  )
}
