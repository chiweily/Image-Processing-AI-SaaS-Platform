import React from 'react'
import { useMemo } from 'react'

const useIcons = () => {
  const icons = useMemo(() => ({
    "/assets/icons/home.svg": require('src/public/assets/icons/home.svg'),
    "/assets/icons/image.svg": require('src/public/assets/icons/image.svg'),
    "/assets/icons/stars.svg": require('src/public/assets/icons/stars.svg'),
    "/assets/icons/scan.svg": require('src/public/assets/icons/scan.svg'),
    "/assets/icons/filter.svg": require('src/public/assets/icons/filter.svg'),
    "/assets/icons/camera.svg": require('src/public/assets/icons/camera.svg'),
    "/assets/icons/profile.svg": require('src/public/assets/icons/profile.svg'),
    "/assets/icons/bag.svg": require('src/public/assets/icons/bag.svg'),
    "/assets/icons/menu.svg": require('src/public/assets/icons/menu.svg'),
    '/assets/images/logo-text.svg': require('src/public/assets/images/logo-text.svg'),
    '/assets/icons/download.svg': require('src/public/assets/icons/download.svg'),
    '/assets/icons/spinner.svg': require('src/public/assets/icons/spinner.svg'),
    '/assets/icons/search.svg': require('src/public/assets/icons/search.svg'),
    '/assets/icons/add.svg': require('src/public/assets/icons/add.svg'),
  }), [])
  return icons
}

export default useIcons
