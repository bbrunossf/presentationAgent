import { writeFile } from 'fs';
import { generateRoute } from './generateRoute';

export function writeRouteToFile(routeName: string) {
  const routeCode = generateRoute(routeName);
  const filePath = `./app/routes/generated/${routeName}.tsx`;

  writeFile(filePath, routeCode, (err) => {
    if (err) throw err;
    console.log(`Rota ${routeName} gerada com sucesso!`);
  });
}
