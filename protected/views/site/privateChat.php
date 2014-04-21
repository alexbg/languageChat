<div class="small-12 medium-6 column left">
    <dl class="accordion" data-accordion>
        <dd>
            <?php echo CHtml::link($data['host'].' and '.$data['inv'], '#p-'.$data['room']) ?>
          
            <div class="content active" id='<?php echo 'p-'.$data['room'] ?>'>
                <div>
                    <ul id='<?php echo 'c-'.$data['room'] ?>' class='no-bullet'>
                        
                    </ul>
                </div>
                <div class='small-9 column'>
                    <?php
                        echo CHtml::textArea('text','',array('id'=>'t-'.$data['room']));
                    ?>
                </div>
                <div class='small-3 column'>
                    <?php    
                        echo Chtml::button('Enviar',array('class'=>'button','id'=>'b-'.$data['room']));
                    ?>
                </div>
            </div>
        </dd>
    </dl>
</div> 
<script>
  $(document).foundation();
</script>

