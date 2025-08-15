declare module '*.module.styl' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.styl' {
  const content: any
  export default content
}

declare module '*.css' {
  const content: any
  export default content
}