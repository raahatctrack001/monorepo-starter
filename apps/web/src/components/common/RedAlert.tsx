import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RedAlert({heading, description}: { heading: string, description: string}){
    return <Alert variant="destructive">
      {/* <Terminal /> */}
      <AlertTitle> {heading} </AlertTitle>
      <AlertDescription> {description} </AlertDescription>
    </Alert>
}