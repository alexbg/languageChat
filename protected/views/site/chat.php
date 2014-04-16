<div id="myModal" class="reveal-modal tiny" data-reveal>
  <h2 id="username">MODAL DE PRUEBA</h2>
  <ul id="information">
      <li id="native">Spanish</li>
      <li id="foreign">English</li>
  </ul>
  <p id="description">Esta es mi desciption</p>
  <a class="close-reveal-modal">&#215;</a>
</div>
<div class="small-12 column">
    
    <div class="small-12 medium-9 column">
        <dl class="accordion" data-accordion>
          <dd>
            <a href="#users">Users online: <span id="total"><?php echo $total; ?></span></a>
            <div id="users" class="content active">
               <?php 
                    $this->widget('zii.widgets.grid.CGridView', array(
                    'id'=>'list-users',
                    'dataProvider'=>$dataProvider,
                    'afterAjaxUpdate'=>'function(){showProfiles()}',  
                    'ajaxUrl'=>Yii::app()->createUrl('site/getGrid'),    
                    'columns'=>array(
                        'username',
                        'native_language',
                        'foreign_language',
                       array(
                        'class'=>'CButtonColumn',
                        'header'=>'Buttons',
                        'template' => '{profile} {private}',   
                        'buttons'=>array(
                            'profile'=>array(
                                'label'=>'show profile',
                                'url'=>'Yii::app()->createUrl("users/getInfoUser",array("username"=>$data["username"]))',
                                'options'=>array(
                                    'class'=>'show',   
                                    ),
                                ),
                            'private'=>array(
                                'label'=>'start chat'
                                )
                            ),
                        )
                    ),
                    'htmlOptions'=>array(
                        'class'=>''
                    )
                ));
                ?>
            </div>
          </dd>
        </dl>
        <div class="small-12 medium-6 column">
         <dl class="accordion" data-accordion>
           <dd>
             <a href="#chat1">Chat1</a>
             <div id="chat1" class="content active">
                fdsafdsafdsafdsfsa
             </div>
           </dd>
         </dl>
     </div>
        <div class="small-12 medium-6 column">
         <dl class="accordion" data-accordion>
           <dd>
             <a href="#chat1">Chat1</a>
             <div id="chat1" class="content active">
                fdsafdsafdsafdsfsa
             </div>
           </dd>
         </dl>
     </div>
        <div class="small-12 medium-6 column">
         <dl class="accordion" data-accordion>
           <dd>
             <a href="#chat1">Chat1</a>
             <div id="chat1" class="content active">
                fdsafdsafdsafdsfsa
             </div>
           </dd>
         </dl>
     </div>
        <div class="small-12 medium-6 column">
         <dl class="accordion" data-accordion>
           <dd>
             <a href="#chat1">Chat1</a>
             <div id="chat1" class="content active">
                fdsafdsafdsafdsfsa
             </div>
           </dd>
         </dl>
     </div>
    </div>
    <div class="small-12 medium-3 column">
        Diccionario
    </div>
    <div class="small-12 medium-6 column">
        
    </div>
</div>

