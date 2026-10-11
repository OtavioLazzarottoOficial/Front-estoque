interface PropsType {
  name: string
  age: number
}

export const Props = (props: PropsType) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}
