// import { Post, RssFeed } from '../../interfaces';
// import { formatDate } from '../../util/arrayDivider';

import { Post, RssFeed } from "../../../Interfaces";
import { formatDate } from "../../../util/formatDate";



export const DividedFeedRss = ({ id, name, posts, image }: RssFeed) => {
  return (
    <table
      key={id}
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      style={{ marginBottom: '2rem', backgroundColor: '#f9f9f9' }}
    >
      <tr>
        <td
          style={{ paddingBottom: '.8rem', borderBottom: '1px solid #e5e5e5' }}
        >
          {image && (
            <img
              width="40"
              height="40"
              src={image}
              alt={name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                marginRight: '8px',
              }}
            />
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0' }}>
            {name}
          </h3>
        </td>
      </tr>

      {posts
        .reduce((rows, post, index) => {
          if (index % 2 === 0) rows.push([post]);
          else rows[rows.length - 1].push(post);
          return rows;
        }, [] as Post[][])
        .map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((post, index) => (
              <td
                key={index}
                width="50%" // 👈 Forzar 50% del ancho
                className="mobile-column"
                style={{
                  padding: '.5rem .2rem',
                  verticalAlign: 'top',
                  width: '50%', // 👈 Redundancia para mayor compatibilidad
                }}
              >
                <a
                  href={post.link}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                >
                  {/* Opción 1: Layout simplificado (Recomendado) */}
                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ width: '100%' }}
                  >
                    {/* {post.image && (
                      <tr>
                        <td style={{ paddingBottom: '8px' }}>
                          <img
                            src={post.image}
                            alt=""
                            width="40"
                            height="40"
                            style={{
                              display: 'block',
                              maxWidth: '40px',
                              height: 'auto',
                            }}
                          />
                        </td>
                      </tr>
                    )} */}
                    <tr>
                      <td>
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '.9rem',
                            fontWeight: '500',
                            color: '#9333ea',
                            lineHeight: '1.3',
                          }}
                        >
                          {post.title}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div
                          style={{
                            fontSize: '.65rem',
                            color: '#777',
                            lineHeight: '1.2',
                          }}
                        >
                          <div style={{ marginBottom: '2px' }}>
                            🗓 {formatDate(post.pubDate)}
                          </div>
                          <div>👤 {post.creator}</div>
                        </div>
                      </td>
                    </tr>
                  </table>

                  {/* Opción 2: Layout con imagen al lado (si prefieres mantener la imagen al lado del texto) */}
                  {/*
                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ width: '100%' }}
                  >
                    <tr>
                      {post.image && (
                        <td width="50" style={{ paddingRight: '8px', verticalAlign: 'top' }}>
                          <img
                            src="https://placehold.co/400"
                            alt=""
                            width="40"
                            height="40"
                            style={{
                              display: 'block',
                              maxWidth: '40px',
                              height: 'auto',
                            }}
                          />
                        </td>
                      )}
                      <td style={{ verticalAlign: 'top' }}>
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '.9rem',
                            fontWeight: '500',
                            color: '#9333ea',
                            lineHeight: '1.3',
                          }}
                        >
                          {post.title}
                        </h4>
                        <div
                          style={{
                            fontSize: '.65rem',
                            color: '#777',
                            lineHeight: '1.2',
                          }}
                        >
                          <div style={{ marginBottom: '2px' }}>
                            🗓 {formatDate(post.pubDate)}
                          </div>
                          <div>👤 {post.creator}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  */}
                </a>
              </td>
            ))}
            {row.length === 1 && (
              <td
                width="50%" // 👈 Forzar 50% del ancho también para la celda vacía
                className="mobile-column"
                style={{
                  padding: '16px 8px',
                  width: '50%',
                  verticalAlign: 'top',
                }}
              ></td>
            )}
          </tr>
        ))}
    </table>
  );
};
// export const DividedFeedRss = ({ id, name, posts }: RssFeed) => {
//   return (
//     <table
//       key={id}
//       width="100%"
//       cellPadding="0"
//       cellSpacing="0"
//       border={0}
//       style={{ marginBottom: '2rem' }}
//     >
//       <tr>
//         <td
//           style={{ paddingBottom: '.8rem', borderBottom: '1px solid #e5e5e5' }}
//         >
//           <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0' }}>
//             {name}
//           </h3>
//         </td>
//       </tr>

//       {posts
//         .reduce((rows, post, index) => {
//           if (index % 2 === 0) rows.push([post]);
//           else rows[rows.length - 1].push(post);
//           return rows;
//         }, [] as Post[][])
//         .map((row, rowIndex) => (
//           <tr key={`row-${rowIndex}`}>
//             {row.map((post, index) => (
//               <td
//                 key={index}
//                 width={'50%'}
//                 className="mobile-column"
//                 style={{
//                   padding: '.5rem .2rem',
//                   verticalAlign: 'top',
//                   width: '50%', // 👈 asegura que los contenidos estén alineados al tope
//                 }}
//               >
//                 <a
//                   href={post.link}
//                   style={{
//                     textDecoration: 'none',
//                     color: 'inherit',
//                     display: 'block',
//                   }}
//                 >
//                   <table
//                     width="100%"
//                     cellPadding="0"
//                     cellSpacing="0"
//                     border={0}
//                     style={{
//                       width: '100%',
//                     }}
//                   >
//                     <tr>
//                       {post.image && (
//                         <td>
//                           <img
//                             src="https://placehold.co/400"
//                             alt=""
//                             width="40"
//                             height="40"
//                             style={{
//                               display: 'block',
//                               maxWidth: '40px',
//                               height: 'auto',
//                             }}
//                           />
//                         </td>
//                       )}

//                       <td>
//                         <tr>
//                           <td colSpan={2}>
//                             <h4
//                               style={{
//                                 textAlign: 'left',
//                                 margin: '0 0 8px 0',
//                                 fontSize: '.9rem',
//                                 fontWeight: '500',
//                                 color: '#9333ea',
//                               }}
//                             >
//                               {post.title}
//                             </h4>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td
//                             style={{
//                               fontSize: '.65rem',
//                               color: '#777',

//                               whiteSpace: 'nowrap',
//                             }}
//                           >
//                             🗓 {formatDate(post.pubDate)}
//                           </td>
//                           <td
//                             style={{
//                               fontSize: '.65rem',
//                               color: '#777',
//                               whiteSpace: 'nowrap',
//                             }}
//                           >
//                             👤 {post.creator}
//                           </td>
//                         </tr>
//                       </td>
//                     </tr>
//                   </table>
//                 </a>
//               </td>
//             ))}
//             {row.length === 1 && (
//               <td
//                 width="50%" // 👈 Forzar 50% del ancho también para la celda vacía
//                 className="mobile-column"
//                 style={{
//                   padding: '.5rem .2rem',
//                   width: '50%',
//                   verticalAlign: 'top',
//                 }}
//               ></td>
//             )}
//           </tr>
//         ))}
//     </table>
//   );
// };
